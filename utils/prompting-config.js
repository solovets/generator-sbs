const path = require('path'),
    fs = require('fs'),
    _ = require('underscore.string'),
    helpTo = require('./helpers'),
    extensions = require('./config/extensions');
    namingConventions = require('./namingConventions'),
    isBemDirectoryExists = require('./isBemDirectoryExists'),

    prompting = {
        general: general,
        rootStyles: rootStyles
    };

function general (dest) {
    return [
        {
            type: 'list',
            name: 'namingConvention',
            message: 'Which naming convention do you prefer?',
            choices: () => {

                let choicesArray = [];

                for (convention in namingConventions) {
                    if (namingConventions.hasOwnProperty(convention)) {

                        choicesArray.push({
                            name: namingConventions[convention].name,
                            value: convention
                        });

                    }
                }

                return choicesArray;
            }
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
            when: (ansers) => {
                return ansers.useCollections;
            },
            filter: (input) => {
                input = _.trim(input, '-_');
                return '--' + input;
            },
            validate: (input) => {
                return helpTo.validateName(null, input, 'collection-suffix', null);
            }
        },
        {
            type: 'input',
            name: 'bemDirectory',
            message: 'Plase define bem root directory',
            default: 'src/styles/bem',
            filter: function(input) {
                input = path.normalize(input);
                input = _.trim(input, path.sep);
                return input;
            },
            validate: function (input, answers) {

                if (isBemDirectoryExists(path.join(dest, input)) !== true) {

                    let pathPoints = [],
                        errorPoint = false,
                        valid;

                    pathPoints = input.split(path.sep);

                    pathPoints.some((item) => {

                        valid = helpTo.validateName(answers.namingConvention, item, 'root', null);

                        if (valid !== true) {
                            errorPoint = item;
                        }

                        return valid !== true;
                    });

                    if (errorPoint !== false) {
                        console.log(' Error in ' + errorPoint);
                        return valid;
                    }


                    answers.createBemDirectory = true;
                }

                return true;
            }
        },
        {
            type: 'list',
            name: 'ext',
            message: 'Which extension of created files do you need?',
            choices: extensions
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
            validate: function (input, answers) {
                if (/^[\.a-zA-Z0-9]+$/.test(input)) {
                    answers.ext = input;
                    return true;
                } else {
                    return 'Allowed characters: dot, A-Z, 0-9';
                }
            }
        }
    ];
}

function rootStyles(dest, previousAnswers) {

    var ext = previousAnswers.ext;

    return [
        {
            type: 'input',
            name: 'rootStylesFile',
            message: 'Please define \"root\" styles file to @import blocks in it',
            default: function () {
                return 'styles.' + ext;
            },
            filter: function (input) {

                var fileName = input;

                if (!new RegExp('\.' + ext + '$').test(input)) {
                    fileName = input + '.' + ext;
                }

                if (fs.existsSync(path.join(dest, previousAnswers.bemDirectory, fileName))) {
                    return fileName;
                } else {
                    input = helpTo.filterName(previousAnswers.namingConvention, input.replace(new RegExp('\.' + ext + '$'), ''), 'root', null);
                    return input + '.' + ext;
                }
            },
            validate: function (input, answers) {

                var pathToRootStyles = path.join(dest, previousAnswers.bemDirectory, input),
                    valid;

                if (fs.existsSync(pathToRootStyles)) {
                    return true;
                } else {
                    valid = helpTo.validateName(previousAnswers.namingConvention, input.replace(new RegExp('\.' + ext + '$')), 'root', null);

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