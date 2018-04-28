const path = require('path');
const fs = require('fs');
const _ = require('underscore.string');

const namingConventions = require('./namingConventions');
const extensions = require('./config/extensions');

const $$ = require('./helpers');
const isBemDirectoryExists = require('./isBemDirectoryExists');

function prompting (dest, test) {

    const prompts = [
        {
            type: 'list',
            name: 'namingConvention',
            message: 'Choose naming convention',
            choices: () => {

                const choicesArray = [];

                for (let convention in namingConventions) {
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
            message: 'Define collection suffix:',
            default: '--bem-collection',
            when: (answers) => {
                return answers.useCollections;
            },
            filter: (input) => {
                return $$.filterName(null, input, 'collection-suffix');
            },
            validate: (input) => {
                return $$.validateName(null, input, 'collection-suffix');
            }
        },
        {
            type: 'input',
            name: 'bemDirectory',
            message: 'Plase define bem root directory',
            default: 'src/styles/bem',
            filter: (input) => {
                return $$.filterName(null, input, 'path');
            },
            validate: (input, answers) => {

                if (isBemDirectoryExists(path.join(dest, input)) !== true) {


                    const pathPoints = input.split(path.sep);
                    let errorPoint = false,
                        valid;

                    pathPoints.some((item) => {

                        valid = $$.validateName(null, item, 'root');

                        if (valid !== true) errorPoint = item;

                        return valid !== true;
                    });

                    if (errorPoint !== false) {
                        return 'Error in ' + errorPoint;
                    }


                    answers.createBemDirectory = true;
                }

                return true;
            }
        },
        {
            type: 'list',
            name: 'ext',
            message: 'Extension of created files:',
            choices: extensions
        },
        {
            type: 'input',
            name: 'customExtension',
            message: 'Please define extension:',
            when: (answers) => {
                return answers.ext === false;
            },
            filter: (input) => {
                return $$.trim(input, ' .');
            },
            validate: (input, answers) => {

                const valid = $$.isAlphanumeric(input);
                if (valid) answers.ext = input;

                return valid;
            }
        },
        {
            type: 'input',
            name: 'rootStylesFile',
            message: 'Please define \"root\" styles file to @import blocks into it',
            default: (answers) => {
                return 'styles.' + answers.ext;
            },
            filter: function (input, answers) {

                const re = new RegExp('\.' + answers.ext + '$');

                let fileName = input;
                if (re.test(input) === false)  fileName += $$.dot(answers.ext);

                if (fs.existsSync(path.join(dest, answers.bemDirectory, fileName))) {
                    return fileName;
                } else {
                    input = $$.filterName(answers.namingConvention, input.replace(re, ''), 'root');
                    return input + $$.dot(answers.ext);
                }
            },
            validate: function (input, answers) {

                const re = new RegExp('\.' + answers.ext + '$');
                const pathToRootStyles = path.join(dest, answers.bemDirectory, input);
                let valid;

                if (fs.existsSync(pathToRootStyles)) {
                    valid = true;
                } else {
                    valid = $$.validateName(answers.namingConvention, input.replace(re, ''), 'root');

                    if (valid) {
                        answers.createRootStylesFile = true;
                    }
                }

                return valid;
            }
        }
    ];

    if (test) {
        prompts.push(
            {
                type: 'confirm',
                name: 'createBemDirectory'
            },
            {
                type: 'confirm',
                name: 'createRootStylesFile'
            }
        );
    }

    return prompts;
}

module.exports = prompting;