const _ = require('underscore.string');
const fs = require('fs');
const path = require('path');
const namingConventions = require('./namingConventions');

const helpers = {
    merge: merge,
    capitalize: capitalize,
    lowFirstLetter: lowFirstLetter,
    dasherize: dasherize,
    classifyModifier: classifyModifier,
    forbiddenFileName: forbiddenFileName,
    isAlphanumeric: isAlphanumeric,
    filterName: filterName,
    validateName: validateName,
    validatePath: validatePath,
    trim: trimmer,
    dot: (string) => { return '.' + string },
    log: console.log,
    json: (obj) => {
        JSON.stringify(obj, null, 4)
    }
};

// This function merge object {a} and object {b}
// and returns object {c}
function merge(a, b) {
    for (let key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }

    return a;
}

function trimmer(string, chars) {
    return chars ? _.trim(string, chars) : _.trim(string);
}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function dasherize(string) {
    string = lowFirstLetter(string);
    string = _.dasherize(string);
    string = _.trim(string, '_-');
    return string.toLowerCase();
}

function classifyModifier(string, separator) {
    let modifierKeyVal = string.split(separator);

    modifierKeyVal.forEach(function (row, index) {
        modifierKeyVal[index] = _.classify(row);
        modifierKeyVal[index] = lowFirstLetter(modifierKeyVal[index]);
    });

    return modifierKeyVal.join(separator);
}

function forbiddenFileName(string) {
    return /^(nul|prn|con|lpt[0-9]|com[0-9])$/i.test(string);
}

function isAlphanumeric(string) {
    if (/^[a-zA-Z0-9]+$/.test(string)) {
        return true;
    } else {
        return 'Allowed characters: A-Z, 0-9';
    }
}

function filterName(convention, input, type) {

    let separator;
    let modifierKeyVal;

    if (convention) {
        separator = namingConventions[convention].prefixForModifier;
    }

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

    if (type === 'collection-suffix') {
        input = '--' + _.trim(input, '-_');
    }

    if (type === 'path') {
        input = path.normalize(input);
        input = _.trim(input, path.sep);
    }

    return input;
}

function validateName(convention, input, type) {

    let separator;

    if (convention) {
        separator = namingConventions[convention].prefixForModifier;
    }

    if (_.isBlank(input)) {
        return 'Can\'t be empty';
    }

    switch (type) {
        case 'block':

            if (forbiddenFileName(input)) {
                return 'Forbidden file name';
            }

            if (/^[0-9]/.test(input)) {
                return 'Block name can\'t start with number';
            }

            break;

        case 'root':

            if (forbiddenFileName(input)) {
                return 'Forbidden file name';
            }

            if (/^\./.test(input) || /\.$/.test(input)) {
                return 'Extra dot(s)';
            }

            break;

        case 'collection-suffix':

            if (/^[a-zA-Z0-9-_]+$/.test(input)) {
                return true;
            } else {
                return 'Allowed characters: 0-9, A-Z, dash and underscore';
            }

            break;
    }

    if (type === 'modifier' &&
        namingConventions[convention].keyValueModifierFormat &&
        input.split(separator).length > 2) {
        return 'Allowed format of modifier is key' + separator + 'value, not more';
    }

    if (/^[_a-zA-Z0-9-]+$/.test(input) !== true) {
        return 'Allowed characters: 0-9, A-Z, dash and underscore';
    }

    return true;
}

function validatePath(input) {

    const pathPoints = input.split(path.sep);
    let valid = true;

    pathPoints.some((item) => {

        valid = validateName(null, item, 'root') ? true : 'Error in ' + item;

        return valid !== true;
    });

    return valid;
}

module.exports = helpers;
