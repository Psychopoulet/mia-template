// module

module.exports = function updateReadme (content, oldName, oldDescription, name, description) {

    return content
        .replaceAll(oldName, name)
        .replace(oldDescription, description);

};
