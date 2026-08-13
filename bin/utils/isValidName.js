// module

module.exports = function isValidName (name) {

    // lowercase, starts with "mia-", npm-compatible
    return /^mia-[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(name);

};
