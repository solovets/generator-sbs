var prompting = function () {
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
            name: 'collectionsSuffix',
            message: 'Please define collection suffix:',
            default: '--bem-collection',
            when: function (ansers) {
                return ansers.useCollections;
            },
            filter: function (input) {
                if (!/^--/.test(input)) {
                    input = '--' + input;
                }

                return input;
            },
            validate: function (input) {
                if (/^[\-\_a-zA-Z0-9]+$/.test(input)) {
                    return true;
                } else {
                    return 'Allowed characters: dash, underscore, latin letters A-Z, numbers 0-9';
                }
            }
        },
        {
            type: 'input',
            name: 'bemDirectory',
            message: 'Plase define bem root directory',
            default: 'src/styles/bem'
        },
        {
            type: 'list',
            name: 'extension',
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
                return answers.extension === false;
            },
            filter: function (input) {
                return input.replace(/^\./, '').replace(/\.$/, '');
            },
            validate: function (input) {
                if (/^[\.a-zA-Z0-9]+$/.test(input)) {
                    return true;
                } else {
                    return 'Allowed characters: dot, latin letters A-Z, numbers 0-9';
                }
            }
        }
    ];
};

module.exports = prompting;