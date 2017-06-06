var path = require('path');
var fs = require('fs');
var _ = require('underscore.string');
var filter = require('./filter-name.js');
var validate = require('./validate-name.js');
var isBemDirectoryExists = require('./isBemDirectoryExists');

prompting = {
    general: general,
    rootStyles: rootStyles
}

function general (dest) {
    return [
        {
            type: 'list',
            name: 'namingConvention',
            message: 'Which naming convention do you prefer?',
            choices: [
                {
                    name: 'Classic style',
                    value: 'classic'
                },
                {
                    name: 'Two Dashes style',
                    value: 'twoDashes'
                },
                {
                    name: 'CamelCase style',
                    value: 'CamelCase'
                },
                {
                    name: '\"Sans underscore\" style',
                    value: 'noUnderscores'
                }
            ]
        },
        {
            type: 'confirm',
            name: 'useCollections',
            message: 'Would you like to use collections?',
            default: false
        },
        {
            type: 'input',
            name: 'collectionSuffix',
            message: 'Please define collection suffix:',
            default: '--bem-collection',
            when: function (ansers) {
                return ansers.useCollections;
            },
            filter: function (input) {
                input = _.trim(input, '-_');
                input = '--' + input;

                return input;
            },
            validate: function (input) {
                if (/^[_a-zA-Z0-9-]+$/.test(input) && input.length > 3) {
                    return true;
                } else {
                    return 'Allowed characters: 0-9, A-Z, dash and underscore';
                }
            }
        },
        {
            type: 'input',
            name: 'bemDirectory',
            message: 'Plase define bem root directory',
            default: 'src/styles/bem',
            validate: function (input) {
                return isBemDirectoryExists(path.join(dest, input), true);
            }
        },
        {
            type: 'list',
            name: 'ext',
            message: 'Which extension of created files do you prefer?',
            choices: [
                {
                    name: 'scss',
                    value: 'scss'
                },
                {
                    name: 'sass',
                    value: 'sass'
                },
                {
                    name: 'styl',
                    value: 'styl'
                },
                {
                    name: 'less',
                    value: 'less'
                },
                {
                    name: 'Other (need to define)',
                    value: false
                }
            ]
        },
        {
            type: 'input',
            name: 'custonExtension',
            message: 'Please define extension:',
            when: function (answers) {
                return answers.ext === false;
            },
            filter: function (input) {
                return _.trim(input, '.');
            },
            validate: function (input) {
                if (/^[\.a-zA-Z0-9]+$/.test(input)) {
                    return true;
                } else {
                    return 'Allowed characters: dot, A-Z, 0-9';
                }
            }
        }
    ];
}

function rootStyles(dest, previousAnswers) {

    var ext = previousAnswers.ext === false ? previousAnswers.custonExtension : previousAnswers.ext;

    return [
        {
            type: 'input',
            name: 'rootStylesFile',
            message: 'Please define \"root\" styles file to @import blocks in it (will be created if doesn\'t exist)',
            default: function () {
                return 'styles.' + (previousAnswers.ext === false ? previousAnswers.custonExtension : previousAnswers.ext);
            },
            filter: function (input) {

                var fileName = input;

                if (!new RegExp('\.' + ext + '$').test(input)) {
                    fileName = input + '.' + ext;
                }
                if (fs.existsSync(path.join(dest, previousAnswers.bemDirectory, fileName))) {
                    return fileName;
                } else {
                    input = filter(previousAnswers.namingConvention, input.replace(new RegExp('\.' + ext + '$'), ''), 'root', null);
                    return input + '.' + ext;
                }
            },
            validate: function (input, answers) {

                var pathToRootStyles = path.join(dest, previousAnswers.bemDirectory, input),
                    valid;

                if (fs.existsSync(pathToRootStyles)) {
                    return true;
                } else {
                    valid = validate(previousAnswers.namingConvention, input.replace(new RegExp('\.' + ext + '$')), 'root', null);

                    if (valid === true) {
                        answers.createRootStylesFile = true;
                    }

                    return valid;
                }
            }

        }
    ]
}

module.exports = prompting;