#!/usr/bin/env node

// deps

    // natives
    const { join, resolve, dirname } = require("node:path");
    const { cp, readFile } = require("node:fs/promises");

    // locals
    const {
        TEMPLATE_ROOT,
        GITIGNORE_FILE,
        PACKAGE_FILENAME
    } = require("./utils/consts");
    const printUsage = require("./utils/printUsage");
    const parseArgs = require("./utils/parseArgs");
    const isValidName = require("./utils/isValidName");
    const formatDescription = require("./utils/formatDescription");
    const parseGitignore = require("./utils/parseGitignore");
    const shouldCopy = require("./utils/shouldCopy");
    const pathExists = require("./utils/pathExists");
    const readJSON = require("./utils/readJSON");
    const updateDestinationFiles = require("./utils/updateDestinationFiles");

// module

(async () => {

    try {

        const options = parseArgs(process.argv.slice(2));

        if (options.help) {

            printUsage();

            process.exit(0);

        }

        if (!options.name || !options.description) {

            printUsage();

            throw new Error("Both --name and --description are required");

        }

        options.name = options.name.toLowerCase();
        options.description = formatDescription(options.description);

        if (!isValidName(options.name)) {

            throw new Error(
                "Invalid plugin name \"" + options.name + "\". "
                + "Use a lowercase name starting with \"mia-\" (e.g. \"mia-my-plugin\")."
            );

        }

        const templatePackage = await readJSON(join(TEMPLATE_ROOT, PACKAGE_FILENAME));
        const oldName = templatePackage.name;
        const oldDescription = templatePackage.description;
        const gitignorePatterns = parseGitignore(await readFile(GITIGNORE_FILE, "utf-8"));

        const destination = options.directory
            ? resolve(process.cwd(), options.directory)
            : join(dirname(TEMPLATE_ROOT), options.name);

        if (resolve(destination) === resolve(TEMPLATE_ROOT)) {
            throw new Error("Destination directory cannot be the template root");
        }

        const destinationExists = await pathExists(destination);

        process.stdout.write(
            (destinationExists ? "Updating existing plugin at " : "Copying template to ")
            + destination + "...\n"
        );

        await cp(TEMPLATE_ROOT, destination, {
            "recursive": true,
            "force": true,
            "filter": (src) => {
                return shouldCopy(src, gitignorePatterns);
            }
        });

        process.stdout.write(
            "Updating package.json, README.md, Descriptor files, class names and front SDK...\n"
        );

        await updateDestinationFiles(
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
