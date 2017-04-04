var selectParentBlockFor = function (component) {
    return 'Please select parent block of ' + component;
};
var existingBlocks = require('./existing-blocks');

var inquirer = require('inquirer');

var prompting = {
    defineCreatedComponent: defineCreaedComponent,
    describeCreatedBlock: describeCreatedBlock,
    describeCreatedElement: describeCreatedElement,
    describeCreatedModifier: describeCreatedModifier
};

function defineCreaedComponent(generatorConfig) {

    return [
        {
            type: 'list',
            name: 'creatingComponentType',
            message: 'What would you like to crate?',
            choices: [
                {
                    name: 'block',
                    value: 'block'
                },
                {
                    name: generatorConfig.prefixForElement + 'element',
                    value: 'element'
                },
                {
                    name: generatorConfig.prefixForModifier + 'modifier',
                    value: 'modifier'
                }
            ]
        },
        {
            type: 'input',
            name: 'creatingComponentName',
            message: 'Please define name:'
        }
    ];
}

function describeCreatedBlock(generatorConfig) {

    return [
        {
            type: 'list',
            name: 'putBlockInCollection',
            message: 'Should I put this Block in collection?',
            when: generatorConfig.useCollections,
            choices: [
                {
                    name: 'No',
                    value: false
                },
                {
                    name: 'Yes',
                    value: true
                }
            ]
        },
        {
            type: 'list',
            name: 'parentCollectionOfBlock',
            message: 'Please choose Collection for block:',
            when: function(answer) {
                return answer.putBlockInCollection;
            },
            choices: [
                {
                    name: 'col1',
                    value: 'col1'
                },
                {
                    name: 'col2',
                    value: 'col2'
                },
                new inquirer.Separator(),
                {
                    name: 'Create new collection',
                    value: 'createNewCollection'
                }
            ]
        },
        {
            type: 'input',
            name: 'newParentCollectionOfBlock',
            when: function (answers) {
                return answers.parentCollectionOfBlock === 'createNewCollection';
            },
            message: 'Please define collection\'s name, suffix ' + generatorConfig.collectionSuffix + ' will be added automatically'
        }
    ];
}

function describeCreatedElement(generatorConfig) {

    return [
        {
            type: 'list',
            name: 'parentBlockOfElement',
            message: selectParentBlockFor(generatorConfig.prefixForElement + 'element'),
            choices: [
                {
                    name: 'block-a',
                    value: 'block-a'
                },
                {
                    name: 'block-b',
                    value: 'block-b'
                },
                {
                    name: 'block-c',
                    value: 'block-c'
                }
            ]
        }
    ];
}

function describeCreatedModifier(generatorConfig) {

    return [
        {
            type: 'list',
            name: 'modifierFor',
            message: 'What is this ' + generatorConfig.prefixForModifier + 'modifier for?',
            choices: [
                {
                    name: 'for block',
                    value: 'forBlock'
                },
                {
                    name: 'for ' + generatorConfig.prefixForElement + 'element',
                    value: 'forElement'
                }
            ]
        }
    ]
}

module.exports = prompting;