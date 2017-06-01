var _ = require('underscore.string');

function filter(convention, input, answers) {

    console.log(' fiiiii ',answers);

    switch (convention) {
        case 'classic':

            // if (type === 'modifier') {
            //     input.split('_');
            // }
            input = _.dasherize(input);
            input = _.trim(input, '_-');
            input = input.toLowerCase();
            break;
        case 'twoDashes':
            break;
        case 'CamelCase':
            break;
        case 'noUnderscores':
            break;
    }

    return input;

}

module.exports = filter;