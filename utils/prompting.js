var selectParentBlockFor = function (component) {
    return 'Please select parent block of ' + component;
};
    var existingBlocks = require('./existing-blocks');

var prompting = {
    defineCreatedComponent: defineCreaedComponent,
    describeCreatedBlock: describeCreatedBlock,
    describeCreatedElement: describeCreatedElement,
    describeCreatedModifier: describeCreatedModifier
};

function defineCreaedComponent(generatorConfig) {

    var prefixForElement = generatorConfig.prefixForElement,
        prefixForModifier = generatorConfig.prefixForModifier,
        useCollections = generatorConfig.useCollections,
        collectionSuffix = generatorConfig.collectionSuffix;

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
                    name: prefixForElement + 'element',
                    value: 'element'
                },
                {
                    name: prefixForModifier + 'modifier',
                    value: 'modifier'
                },
                {
                    name: 'new ' + collectionSuffix,
                    value: 'collection'
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

    var prefixForElement = generatorConfig.prefixForElement,
        prefixForModifier = generatorConfig.prefixForModifier,
        useCollections = generatorConfig.useCollections,
        collectionSuffix = generatorConfig.collectionSuffix;

    return [
        {
            type: 'list',
            name: 'putBlockInCollection',
            message: 'Should I put this Block in collection?',
            when: useCollections,
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
                }
            ]
        }
    ];
}

function describeCreatedElement(generatorConfig) {

    var prefixForElement = generatorConfig.prefixForElement,
        prefixForModifier = generatorConfig.prefixForModifier,
        useCollections = generatorConfig.useCollections,
        collectionSuffix = generatorConfig.collectionSuffix;

    return [
        {
            type: 'list',
            name: 'parentBlockOfElement',
            message: selectParentBlockFor(prefixForElement + 'element'),
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

    var prefixForElement = generatorConfig.prefixForElement,
        prefixForModifier = generatorConfig.prefixForModifier,
        useCollections = generatorConfig.useCollections,
        collectionSuffix = generatorConfig.collectionSuffix;

    return [
        {
            type: 'list',
            name: 'modifierFor',
            message: 'What is this ' + prefixForModifier + 'modifier for?',
            choices: [
                {
                    name: 'for block',
                    value: 'forBlock'
                },
                {
                    name: 'for ' + prefixForElement + 'element',
                    value: 'forElement'
                }
            ]
        }
    ]
}

module.exports = prompting;