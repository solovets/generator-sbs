var _ = require('underscore.string');

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

function filter(convention, input, type, separator) {

    var modifierKeyVal;

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

module.exports = filter;