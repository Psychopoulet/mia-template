// deps

    // natives
    const { access, constants } = require("node:fs/promises");

// module

module.exports = async function pathExists (path) {

    try {
        await access(path, constants.F_OK);
        return true;
    }
    catch (_) {
        return false;
    }

};
