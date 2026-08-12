// module

module.exports = function formatDescription (description) {

    let value = String(description).trim();

    if (!value) {
        return value;
    }

    value = value.charAt(0).toUpperCase() + value.slice(1);

    if (!value.endsWith(".")) {
        value += ".";
    }

    return value;

};
