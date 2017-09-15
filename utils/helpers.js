const _ = require('underscore.string');

var helpers = {
    merge: merge,
    capitalize: capitalize,
    dasherize: dasherize,
    filterName: filterName,
    validateName: validateName
};

// This function merge object {a} and object {b}
// and returns object {c}
function merge(a, b) {
    var key;
    for (key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }

    return a;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function dasherize(string) {
    string = _.dasherize(string);
    string = _.trim(string, '_-');
    return string.toLowerCase();
}

function lowFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function classifyModifier(string, separator) {
    var modifierKeyVal = string.split(separator);

    modifierKeyVal.forEach(function (row, index) {
        modifierKeyVal[index] = _.classify(row);
        modifierKeyVal[index] = lowFirstLetter(modifierKeyVal[index]);
    });

    return modifierKeyVal.join(separator);
}

function filterName(convention, input, type, separator) {
    var modifierKeyVal;

    input = _.trim(input);

    switch (convention) {
        case 'classic':
            if (type === 'modifier') {
                modifierKeyVal = input.split(separator);
                modifierKeyVal.forEach(function (row, index) {
                    modifierKeyVal[index] = dasherize(row);
                });
                input = modifierKeyVal.join(separator);
            } else {
                input = dasherize(input);
            }
            break;
        case 'twoDashes':
            input = dasherize(input);
            break;
        case 'CamelCase':
            if (type === 'modifier') {
                input = classifyModifier(input, separator);
            } else {
                input = _.classify(input);
            }
            break;
        case 'noUnderscores':
            if (type === 'modifier') {
                input = classifyModifier(input, separator);
            } else {
                input = _.classify(input);
                input = lowFirstLetter(input);
            }
            break;
    }

    return input;
}

function validateName(convention, input, type, separator) {
    if (_.isBlank(input)) {
        return 'Can\'t be empty';
    }

    if (type === 'block') {

        if (/^(nul|prn|con|lpt[0-9]|com[0-9])$/i.test(input)) {
            return 'Forbidden file name';
        }

        if (/^[0-9]+/.test(input)) {
            return 'Block name can\'t start with number';
        }
    }

    if (type === 'root') {

        if (/^(nul|prn|con|lpt[0-9]|com[0-9])$/i.test(input)) {
            return 'Forbidden file name';
        }

        if (/^\./.test(input) || /\.$/.test(input)) {
            return 'Extra dot(s)';
        }

    }

    if (type === 'collection-suffix') {

        let collection_suffix = _.trim(input, '-_');

        if (/^[a-zA-Z0-9-_]+$/.test(collection_suffix)) {
            return true;
        } else {
            return 'Allowed characters: 0-9, A-Z, dash and underscore';
        }
    }

    if (convention === 'classic' || convention === 'CamelCase' || convention === 'noUnderscores') {
        if (type === 'modifier' && input.split(separator).length > 2) {
            return 'Allowed format of modifier is key' + separator + 'value, not more';
        }
    }

    if (!/^[_a-zA-Z0-9-]+$/.test(input)) {
        return 'Allowed characters: 0-9, A-Z, dash and underscore';
    }

    return true;
}

module.exports = helpers;
