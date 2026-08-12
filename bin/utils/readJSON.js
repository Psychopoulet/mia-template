// deps

    // natives
    const { readFile } = require("node:fs/promises");

// module

module.exports = async function readJSON (filePath) {

    return JSON.parse(await readFile(filePath, "utf-8"));

};
