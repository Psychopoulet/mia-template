// module

module.exports = function printUsage () {

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

};
