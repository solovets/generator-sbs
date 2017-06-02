var _ = require('underscore.string');

function validate(convention, input, type, separator) {

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

module.exports = validate;