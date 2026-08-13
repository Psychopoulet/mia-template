// deps

    // natives
    const { writeFile } = require("node:fs/promises");

// module

module.exports = async function writeJSON (filePath, data, space) {

    await writeFile(filePath, JSON.stringify(data, null, space) + "\n", "utf-8");

};
