// module

module.exports = function parseArgs (argv) {

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

};
