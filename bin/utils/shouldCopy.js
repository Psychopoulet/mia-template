// deps

    // natives
    const { relative } = require("node:path");

    // locals
    const { TEMPLATE_ROOT } = require("./consts");
    const isIgnoredByGitignore = require("./isIgnoredByGitignore");

// module

module.exports = function shouldCopy (srcPath, gitignorePatterns) {

    const relativePath = relative(TEMPLATE_ROOT, srcPath);

    if (!relativePath || "" === relativePath) {
        return true;
    }

    return !isIgnoredByGitignore(relativePath, gitignorePatterns);

};
