// deps

    // natives
    const { join } = require("node:path");
    const { readFile, writeFile } = require("node:fs/promises");

    // locals
    const {
        PACKAGE_FILENAME,
        README_FILENAME,
        DESCRIPTOR_FILENAME,
        DESCRIPTOR_EVENTS_FILENAME,
        MEDIATOR_FILENAME,
        ORCHESTRATOR_FILENAME,
        SERVER_FILENAME,
        POSTFIX_EVENTS_NAME,
        POSTFIX_EVENTS_DESCRIPTION
    } = require("./consts");
    const readJSON = require("./readJSON");
    const writeJSON = require("./writeJSON");
    const toPascalCaseSuffix = require("./toPascalCaseSuffix");
    const replacePluginNameInDescriptor = require("./replacePluginNameInDescriptor");
    const updateReadme = require("./updateReadme");
    const updateClassNames = require("./updateClassNames");

// module

module.exports = async function updateDestinationFiles (destination, name, description, oldName, oldDescription) {

    const packagePath = join(destination, PACKAGE_FILENAME);
    const readmePath = join(destination, README_FILENAME);
    const descriptorPath = join(destination, DESCRIPTOR_FILENAME);
    const descriptorEventsPath = join(destination, DESCRIPTOR_EVENTS_FILENAME);
    const mediatorPath = join(destination, MEDIATOR_FILENAME);
    const orchestratorPath = join(destination, ORCHESTRATOR_FILENAME);
    const serverPath = join(destination, SERVER_FILENAME);

    const packageData = await readJSON(packagePath);
    const readme = await readFile(readmePath, "utf-8");
    const descriptor = await readJSON(descriptorPath);
    const descriptorEvents = await readJSON(descriptorEventsPath);
    const mediator = await readFile(mediatorPath, "utf-8");
    const orchestrator = await readFile(orchestratorPath, "utf-8");
    const server = await readFile(serverPath, "utf-8");

    const oldClassSuffix = toPascalCaseSuffix(oldName);
    const newClassSuffix = toPascalCaseSuffix(name);

    packageData.name = name;
    packageData.description = description;

    descriptor.info.description = description;
    replacePluginNameInDescriptor(descriptor, oldName, name);

    descriptorEvents.info.title = name + POSTFIX_EVENTS_NAME;
    descriptorEvents.info.description = description + POSTFIX_EVENTS_DESCRIPTION;
    descriptorEvents.info.version = packageData.version;

    await writeJSON(packagePath, packageData, 2);
    await writeFile(
        readmePath,
        updateReadme(readme, oldName, oldDescription, name, description),
        "utf-8"
    );
    await writeJSON(descriptorPath, descriptor, "\t");
    await writeJSON(descriptorEventsPath, descriptorEvents, "\t");
    await writeFile(mediatorPath, updateClassNames(mediator, oldClassSuffix, newClassSuffix), "utf-8");
    await writeFile(orchestratorPath, updateClassNames(orchestrator, oldClassSuffix, newClassSuffix), "utf-8");
    await writeFile(serverPath, updateClassNames(server, oldClassSuffix, newClassSuffix), "utf-8");

};
