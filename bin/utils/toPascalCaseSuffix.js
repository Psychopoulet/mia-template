// module

module.exports = function toPascalCaseSuffix (pluginName) {

    // "mia-my-plugin" -> "MyPlugin"
    return pluginName.replace(/^mia-/, "").split(/[^a-z0-9]+/i).filter(Boolean).map((part) => {

        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();

    }).join("");

};
