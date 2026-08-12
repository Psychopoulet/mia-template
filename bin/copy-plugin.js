#!/usr/bin/env node

// deps

    // natives
    const { join, resolve, relative, dirname, sep } = require("node:path");
    const { cp, readFile, writeFile, access, constants } = require("node:fs/promises");

// consts

    const TEMPLATE_ROOT = join(__dirname, "..");
        const GITIGNORE_FILE = join(TEMPLATE_ROOT, ".gitignore");

        const PACKAGE_FILENAME = "package.json";
        const DESCRIPTOR_FILENAME = join("lib", "data", "Descriptor.json");
        const DESCRIPTOR_EVENTS_FILENAME = join("lib", "data", "DescriptorEvents.json");
        const README_FILENAME = "README.md";
        const MEDIATOR_FILENAME = join("lib", "src", "Mediator.ts");
        const ORCHESTRATOR_FILENAME = join("lib", "src", "Orchestrator.ts");
        const SERVER_FILENAME = join("lib", "src", "Server.ts");
        const MAIN_FILENAME = join("lib", "src", "main.cts");

    const POSTFIX_EVENTS_NAME = " - events";
    const POSTFIX_EVENTS_DESCRIPTION = " Events description.";

    // always excluded even if absent from .gitignore
    const ALWAYS_EXCLUDED = [ ".git", "bin" ];

// private

    function _printUsage () {

        process.stdout.write([
            "Usage:",
            "  create-mia-plugin --name <name> --description <description> [--directory <path>]",
            "",
            "Options:",
            "  -n, --name         Plugin name (package name, lowercase, must start with \"mia-\")",
            "  -d, --description  Plugin description",
            "  -o, --directory    Destination directory (default: sibling folder named after the plugin)",
            "  -h, --help         Show help",
            ""
        ].join("\n"));

    }

    function _parseArgs (argv) {

        const options = {
            "name": null,
            "description": null,
            "directory": null,
            "help": false
        };

        const positionals = [];

        for (let i = 0; i < argv.length; ++i) {

            switch (argv[i]) {

                case "-h":
                case "--help":
                    options.help = true;
                break;

                case "-n":
                case "--name":
                    options.name = argv[++i] || null;
                break;

                case "-d":
                case "--description":
                    options.description = argv[++i] || null;
                break;

                case "-o":
                case "--directory":
                    options.directory = argv[++i] || null;
                break;

                default:

                    if (argv[i].startsWith("-")) {
                        throw new Error("Unknown option \"" + argv[i] + "\"");
                    }

                    positionals.push(argv[i]);

                break;

            }

        }

        if (!options.name && positionals[0]) {
            options.name = positionals[0];
        }

        if (!options.description && positionals[1]) {
            options.description = positionals[1];
        }

        if (!options.directory && positionals[2]) {
            options.directory = positionals[2];
        }

        return options;

    }

    function _isValidName (name) {

        // lowercase, starts with "mia-", npm-compatible
        return /^mia-[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(name);

    }

    function _toPascalCaseSuffix (pluginName) {

        // "mia-my-plugin" -> "MyPlugin"
        return pluginName.replace(/^mia-/, "").split(/[^a-z0-9]+/i).filter(Boolean).map((part) => {

            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();

        }).join("");

    }

    function _updateClassNames (content, oldSuffix, newSuffix) {

        return content
            .replaceAll("Orchestrator" + oldSuffix, "Orchestrator" + newSuffix)
            .replaceAll("Mediator" + oldSuffix, "Mediator" + newSuffix)
            .replaceAll("Server" + oldSuffix, "Server" + newSuffix);

    }

    function _parseGitignore (content) {

        return content.split(/\r?\n/).map((line) => {

            return line.trim();

        }).filter((line) => {

            return Boolean(line) && !line.startsWith("#");

        });

    }

    function _gitignorePatternToRegExp (pattern) {

        let dirOnly = false;
        let anchored = false;
        let value = pattern;

        if (value.endsWith("/")) {
            dirOnly = true;
            value = value.slice(0, -1);
        }

        if (value.startsWith("/")) {
            anchored = true;
            value = value.slice(1);
        }
        else if (value.includes("/")) {
            anchored = true;
        }

        const escaped = value
            .replace(/[.+^${}()|[\]\\]/g, "\\$&")
            .replace(/\*\*/g, "{{GLOBSTAR}}")
            .replace(/\*/g, "[^/]*")
            .replace(/\?/g, "[^/]")
            .replace(/{{GLOBSTAR}}/g, ".*");

        const body = anchored
            ? "^" + escaped
            : "(^|/)" + escaped;

        // match the path itself, or anything nested under a matched directory
        return new RegExp(body + (dirOnly ? "($|/)" : "($|/)"));

    }

    function _isIgnoredByGitignore (relativePath, patterns) {

        const normalized = relativePath.split(sep).join("/");

        if (!normalized || "." === normalized) {
            return false;
        }

        for (let i = 0; i < ALWAYS_EXCLUDED.length; ++i) {

            const excluded = ALWAYS_EXCLUDED[i];

            if (normalized === excluded || normalized.startsWith(excluded + "/")) {
                return true;
            }

        }

        for (let i = 0; i < patterns.length; ++i) {

            if (_gitignorePatternToRegExp(patterns[i]).test(normalized)) {
                return true;
            }

        }

        return false;

    }

    function _shouldCopy (srcPath, gitignorePatterns) {

        const relativePath = relative(TEMPLATE_ROOT, srcPath);

        if (!relativePath || "" === relativePath) {
            return true;
        }

        return !_isIgnoredByGitignore(relativePath, gitignorePatterns);

    }

    async function _pathExists (path) {

        try {
            await access(path, constants.F_OK);
            return true;
        }
        catch (_) {
            return false;
        }

    }

    async function _readJSON (filePath) {
        return JSON.parse(await readFile(filePath, "utf-8"));
    }

    async function _writeJSON (filePath, data, space) {
        await writeFile(filePath, JSON.stringify(data, null, space) + "\n", "utf-8");
    }

    function _replacePluginNameInDescriptor (descriptor, oldName, newName) {

        descriptor.info.title = newName;

        if (descriptor.paths) {

            const nextPaths = {};

            for (const [ pathKey, pathValue ] of Object.entries(descriptor.paths)) {
                nextPaths[pathKey.split("/" + oldName + "/").join("/" + newName + "/")] = pathValue;
            }

            descriptor.paths = nextPaths;

        }

        if (descriptor.components
            && descriptor.components.schemas
            && descriptor.components.schemas.PluginName
            && descriptor.components.schemas.PluginName.enum
        ) {
            descriptor.components.schemas.PluginName.enum = [ newName ];
        }

        return descriptor;

    }

    function _updateReadme (content, oldName, oldDescription, name, description) {

        return content
            .replaceAll(oldName, name)
            .replace(oldDescription, description);

    }

    async function _updateDestinationFiles (destination, name, description, oldName, oldDescription) {

        const packagePath = join(destination, PACKAGE_FILENAME);
        const readmePath = join(destination, README_FILENAME);
        const descriptorPath = join(destination, DESCRIPTOR_FILENAME);
        const descriptorEventsPath = join(destination, DESCRIPTOR_EVENTS_FILENAME);
        const mediatorPath = join(destination, MEDIATOR_FILENAME);
        const orchestratorPath = join(destination, ORCHESTRATOR_FILENAME);
        const serverPath = join(destination, SERVER_FILENAME);

        const packageData = await _readJSON(packagePath);
        const readme = await readFile(readmePath, "utf-8");
        const descriptor = await _readJSON(descriptorPath);
        const descriptorEvents = await _readJSON(descriptorEventsPath);
        const mediator = await readFile(mediatorPath, "utf-8");
        const orchestrator = await readFile(orchestratorPath, "utf-8");
        const server = await readFile(serverPath, "utf-8");

        const oldClassSuffix = _toPascalCaseSuffix(oldName);
        const newClassSuffix = _toPascalCaseSuffix(name);

        packageData.name = name;
        packageData.description = description;

        descriptor.info.description = description;
        _replacePluginNameInDescriptor(descriptor, oldName, name);

        descriptorEvents.info.title = name + POSTFIX_EVENTS_NAME;
        descriptorEvents.info.description = description + POSTFIX_EVENTS_DESCRIPTION;
        descriptorEvents.info.version = packageData.version;

        await _writeJSON(packagePath, packageData, 2);
        await writeFile(
            readmePath,
            _updateReadme(readme, oldName, oldDescription, name, description),
            "utf-8"
        );
        await _writeJSON(descriptorPath, descriptor, "\t");
        await _writeJSON(descriptorEventsPath, descriptorEvents, "\t");
        await writeFile(mediatorPath, _updateClassNames(mediator, oldClassSuffix, newClassSuffix), "utf-8");
        await writeFile(orchestratorPath, _updateClassNames(orchestrator, oldClassSuffix, newClassSuffix), "utf-8");
        await writeFile(serverPath, _updateClassNames(server, oldClassSuffix, newClassSuffix), "utf-8");

    }

// module

(async () => {

    try {

        const options = _parseArgs(process.argv.slice(2));

        if (options.help) {

            _printUsage();

            process.exit(0);

        }

        if (!options.name || !options.description) {

            _printUsage();

            throw new Error("Both --name and --description are required");

        }

        options.name = options.name.toLowerCase();

        if (!_isValidName(options.name)) {

            throw new Error(
                "Invalid plugin name \"" + options.name + "\". "
                + "Use a lowercase name starting with \"mia-\" (e.g. \"mia-my-plugin\")."
            );

        }

        const templatePackage = await _readJSON(join(TEMPLATE_ROOT, PACKAGE_FILENAME));
        const oldName = templatePackage.name;
        const oldDescription = templatePackage.description;
        const gitignorePatterns = _parseGitignore(await readFile(GITIGNORE_FILE, "utf-8"));

        const destination = options.directory
            ? resolve(process.cwd(), options.directory)
            : join(dirname(TEMPLATE_ROOT), options.name);

        if (resolve(destination) === resolve(TEMPLATE_ROOT)) {
            throw new Error("Destination directory cannot be the template root");
        }

        const destinationExists = await _pathExists(destination);

        process.stdout.write(
            (destinationExists ? "Updating existing plugin at " : "Copying template to ")
            + destination + "...\n"
        );

        await cp(TEMPLATE_ROOT, destination, {
            "recursive": true,
            "force": true,
            "filter": (src) => {
                return _shouldCopy(src, gitignorePatterns);
            }
        });

        process.stdout.write(
            "Updating package.json, README.md, Descriptor files and class names...\n"
        );

        await _updateDestinationFiles(
            destination,
            options.name,
            options.description,
            oldName,
            oldDescription
        );

        process.stdout.write(
            "Plugin \"" + options.name + "\" "
            + (destinationExists ? "updated" : "created")
            + " at " + destination + "\n"
        );

    }
    catch (err) {

        process.stderr.write("Error: " + err.message + "\n");
        process.exit(1);

    }

})();
