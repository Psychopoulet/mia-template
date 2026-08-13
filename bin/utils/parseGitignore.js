// module

module.exports = function parseGitignore (content) {

    return content.split(/\r?\n/).map((line) => {

        return line.trim();

    }).filter((line) => {

        return Boolean(line) && !line.startsWith("#");

    });

};
