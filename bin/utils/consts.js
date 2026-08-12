// deps

    // natives
    const { join } = require("node:path");

// consts

    const TEMPLATE_ROOT = join(__dirname, "..", "..");
    const GITIGNORE_FILE = join(TEMPLATE_ROOT, ".gitignore");

    const PACKAGE_FILENAME = "package.json";
    const DESCRIPTOR_FILENAME = join("lib", "data", "Descriptor.json");
    const DESCRIPTOR_EVENTS_FILENAME = join("lib", "data", "DescriptorEvents.json");
    const README_FILENAME = "README.md";
    const MEDIATOR_FILENAME = join("lib", "src", "Mediator.ts");
    const ORCHESTRATOR_FILENAME = join("lib", "src", "Orchestrator.ts");
    const SERVER_FILENAME = join("lib", "src", "Server.ts");

    const POSTFIX_EVENTS_NAME = " - events";
    const POSTFIX_EVENTS_DESCRIPTION = " Events description.";

    // always excluded even if absent from .gitignore
    const ALWAYS_EXCLUDED = [ ".git", "bin" ];

// module

module.exports = {
    TEMPLATE_ROOT,
    GITIGNORE_FILE,
    PACKAGE_FILENAME,
    DESCRIPTOR_FILENAME,
    DESCRIPTOR_EVENTS_FILENAME,
    README_FILENAME,
    MEDIATOR_FILENAME,
    ORCHESTRATOR_FILENAME,
    SERVER_FILENAME,
    POSTFIX_EVENTS_NAME,
    POSTFIX_EVENTS_DESCRIPTION,
    ALWAYS_EXCLUDED
};
