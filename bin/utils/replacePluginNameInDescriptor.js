// module

module.exports = function replacePluginNameInDescriptor (descriptor, oldName, newName) {

    descriptor.info.title = newName;

    if (descriptor.paths) {

        const nextPaths = {};

        for (const [ pathKey, pathValue ] of Object.entries(descriptor.paths)) {
            nextPaths[pathKey.split("/" + oldName + "/").join("/" + newName + "/")] = pathValue;
        }

        descriptor.paths = nextPaths;

    }

    if (descriptor.components
        && descriptor.components.schemas
        && descriptor.components.schemas.PluginName
        && descriptor.components.schemas.PluginName.enum
    ) {
        descriptor.components.schemas.PluginName.enum = [ newName ];
    }

    return descriptor;

};
