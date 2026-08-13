// module

module.exports = function updateClassNames (content, oldSuffix, newSuffix) {

    return content
        .replaceAll("Orchestrator" + oldSuffix, "Orchestrator" + newSuffix)
        .replaceAll("Mediator" + oldSuffix, "Mediator" + newSuffix)
        .replaceAll("Server" + oldSuffix, "Server" + newSuffix);

};
