var selectParentBlockFor = function (component) {
    return 'Please select parent block of ' + component;
};
var existingBlocks = require('./current-structure');

var inquirer = require('inquirer');

var prompting = {
    defineCreatedComponent: defineCreaedComponent,
    describeCreatedBlock: describeCreatedBlock,
    describeCreatedElement: describeCreatedElement,
    describeCreatedModifier: describeCreatedModifier
};

function validation(name) {
    // if (name === '') {
    //     return 'Name Can\'t be empty!';
    // }

    return true;
}

function getBlocks(currentStructure, useCollections) {
    var choicesArray = [];

    currentStructure.blocks.forEach(function(block) {
        choicesArray.push({
            name: block.name,
            value: {
                blockName: block.name,
                collectionName: false
            }
        });
    });

    if (useCollections) {
        currentStructure.collections.forEach(function(collection) {
            collection.blocks.forEach(function(block) {
                choicesArray.push({
                    name: block.name + ' @ ' + collection.name,
                    value: {
                        blockName: block.name,
                        collectionName: collection.name
                    }
                });
            });
        });
    }

    return choicesArray;
}

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
            message: 'Please define name:',
            validate: function (value, r) {
                console.log(value, answer);
                //validation(value);
            }
        }
    ];
}

function describeCreatedBlock(generatorConfig, currentStructure) {

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
            choices: function () {
                var choicesArray = [];

                currentStructure.collections.forEach(function (collection) {
                    choicesArray.push({
                        name: collection.name,
                        value: collection.name
                    });
                });

                choicesArray.push(
                    new inquirer.Separator(),
                    {
                        name: 'Create new collection',
                        value: false
                    }
                );

                return choicesArray;
            }
        },
        {
            type: 'input',
            name: 'newParentCollectionOfBlock',
            when: function (answers) {
                return answers.parentCollectionOfBlock === false;
            },
            message: 'Please define collection\'s name, suffix ' + generatorConfig.collectionSuffix + ' will be added automatically'
        }
    ];
}

function describeCreatedElement(generatorConfig, currentStructure) {

    return [
        {
            type: 'list',
            name: 'parentBlockOfElement',
            message: selectParentBlockFor(generatorConfig.prefixForElement + 'element'),
            choices: getBlocks(currentStructure, generatorConfig.useCollections)
        }
    ];
}

function describeCreatedModifier(generatorConfig, currentStructure) {

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
        },
        {
            type: 'list',
            name: 'parentBlockOfModifier',
            message: function (answer) {
                var str = answer.modifierFor === 'forElement' ? ' that contains ' + generatorConfig.prefixForElement + 'element' : '';

                return 'Please define block' + str;
            },
            choices: getBlocks(currentStructure, generatorConfig.useCollections)
        },
        {
            type: 'list',
            name: 'parentElementOfModifier',
            message: 'Please define parent ' + generatorConfig.prefixForElement + 'element of ' + generatorConfig.prefixForModifier + 'modifier',
            when: function(answer) {
                return answer.modifierFor === 'forElement';
            },
            choices: function(answer) {

                var blocksArray,
                    blockPoint,
                    collectionPoint,
                    choicesArray = [];

                if (answer.parentBlockOfModifier.collectionName === false)  {
                    blocksArray = currentStructure.blocks;
                } else {
                    collectionPoint = currentStructure.collections.filter(function (collection) {
                        return collection.name === answer.parentBlockOfModifier.collectionName;
                    });
                    blocksArray = collectionPoint[0].blocks;
                    //blocksArray = currentStructure.collections[answer.parentBlockOfModifier.collectionName].blocks;
                }

                blockPoint = blocksArray.filter(function(item) {
                    return item.name === answer.parentBlockOfModifier.blockName;
                });

                blockPoint[0].elements.forEach(function (element) {
                    choicesArray.push({
                        name: element.name,
                        value: element.name
                    });
                });

                return choicesArray;
            }
        }
    ]
}

module.exports = prompting;