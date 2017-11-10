const path = require('path');
const fs = require('fs');
const _ = require('underscore.string');
const helpTo = require('./helpers');
const extensions = require('./config/extensions');
const namingConventions = require('./namingConventions');
const isBemDirectoryExists = require('./isBemDirectoryExists');

function prompting (dest) {
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
        },
        {
            type: 'input',
            name: 'rootStylesFile',
            message: 'Please define \"root\" styles file to @import blocks in it',
            default: (answers) => {
                return 'styles.' + answers.ext;
            },
            filter: function (input, answers) {

                let fileName = input;

                if (!new RegExp('\.' + answers.ext + '$').test(input)) {
                    fileName = input + '.' + answers.ext;
                }

                if (fs.existsSync(path.join(dest, answers.bemDirectory, fileName))) {
                    return fileName;
                } else {
                    input = helpTo.filterName(answers.namingConvention, input.replace(new RegExp('\.' + answers.ext + '$'), ''), 'root', null);
                    return input + '.' + answers.ext;
                }
            },
            validate: function (input, answers) {

                let pathToRootStyles = path.join(dest, answers.bemDirectory, input),
                    valid;

                if (fs.existsSync(pathToRootStyles)) {
                    return true;
                } else {
                    valid = helpTo.validateName(answers.namingConvention, input.replace(new RegExp('\.' + answers.ext + '$')), 'root', null);

                    if (valid === true) {
                        answers.createRootStylesFile = true;
                    }

                    return valid;
                }
            }
        }
    ];
}

module.exports = prompting;