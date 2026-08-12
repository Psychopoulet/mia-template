// deps

    // natives
    const { sep } = require("node:path");

    // locals
    const { ALWAYS_EXCLUDED } = require("./consts");
    const gitignorePatternToRegExp = require("./gitignorePatternToRegExp");

// module

module.exports = function isIgnoredByGitignore (relativePath, patterns) {

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

        if (gitignorePatternToRegExp(patterns[i]).test(normalized)) {
            return true;
        }

    }

    return false;

};
