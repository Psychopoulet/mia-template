// module

module.exports = function gitignorePatternToRegExp (pattern) {

    let dirOnly = false;
    let anchored = false;
    let value = pattern;

    if (value.endsWith("/")) {
        dirOnly = true;
        value = value.slice(0, -1);
    }

    if (value.startsWith("/")) {
        anchored = true;
        value = value.slice(1);
    }
    else if (value.includes("/")) {
        anchored = true;
    }

    const escaped = value
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*/g, "{{GLOBSTAR}}")
        .replace(/\*/g, "[^/]*")
        .replace(/\?/g, "[^/]")
        .replace(/{{GLOBSTAR}}/g, ".*");

    const body = anchored
        ? "^" + escaped
        : "(^|/)" + escaped;

    // match the path itself, or anything nested under a matched directory
    return new RegExp(body + (dirOnly ? "($|/)" : "($|/)"));

};
