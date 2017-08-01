var existingBlocks = require('./current-structure');
var path = require('path');
var helpTo = require('./helpers');
var inquirer = require('inquirer');
var _ = require('underscore.string');

var prompting = {
    defineCreatedComponent: defineCreaedComponent,
    describeCreatedBlock: describeCreatedBlock,
    describeCreatedElement: describeCreatedElement,
    describeCreatedModifier: describeCreatedModifier
};

function getBlocks(currentStructure, useCollections) {
    var choicesArray = [];

    currentStructure.blocks.forEach(function(block) {
        choicesArray.push({
            name: block.name,
            value: {
                blockName: block.name,
                collectionName: ''
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

function askName(convention, type, separator) {
    return {
        type: 'input',
        name: 'creatingComponentName',
        message: 'Please define name:',
        filter: function (input) {
            return helpTo.filterName(convention, input, type, separator);
        },
        validate: function (input, answers) {
            return helpTo.validateName(convention, input, type, separator);
        }
    }
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
        }
    ];
}

function describeCreatedBlock(generatorConfig, currentStructure, previousAnswers) {

    return [
        askName(generatorConfig.namingConvention, previousAnswers.creatingComponentType, generatorConfig.prefixForModifier),
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
            when: function(answers) {

                if (answers.putBlockInCollection === false) {
                    answers.parentCollectionOfBlock = '';
                }

                return answers.putBlockInCollection;


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
            when: answers.parentCollectionOfBlock === false,
            message: 'Please define collection\'s name, suffix ' + generatorConfig.collectionSuffix + ' will be added automatically',
            filter: function (input) {
                input = input.replace(new RegExp(generatorConfig.collectionSuffix + '$', 'i'), '');
                input = _.ltrim(input);
                input = _.rtrim(input, '-_');

                return input;
            },
            validate: function (input, answers) {
                var valid = helpTo.validateName(generatorConfig.namingConvention, input, null, null);

                if (valid === true) {
                    answers.parentCollectionOfBlock = input + generatorConfig.collectionSuffix;
                }

                return valid;
            }
        }
    ];
}

function describeCreatedElement(generatorConfig, currentStructure, previousAnswers) {

    return [
        askName(generatorConfig.namingConvention, previousAnswers.creatingComponentType, generatorConfig.prefixForModifier),
        {
            type: 'list',
            name: 'parentBlock',
            message: 'Parent block for ' + generatorConfig.prefixForElement + 'element',
            choices: getBlocks(currentStructure, generatorConfig.useCollections)
        }
    ];
}

function describeCreatedModifier(generatorConfig, currentStructure, previousAnswers) {

    return [
        askName(generatorConfig.namingConvention, previousAnswers.creatingComponentType, generatorConfig.prefixForModifier),
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
            name: 'parentBlock',
            message: function (answers) {
                var str;

                if (answers.modifierFor === 'forElement') {
                    str = ' that contains ' + generatorConfig.prefixForElement + 'element';
                } else {
                    str = ' to modify';
                }

                return 'Block' + str;
            },
            choices: getBlocks(currentStructure, generatorConfig.useCollections)
        },
        {
            type: 'list',
            name: 'parentElement',
            message: 'Please define parent ' + generatorConfig.prefixForElement + 'element of ' + generatorConfig.prefixForModifier + 'modifier',
            when: function(answers) {
				answers.parentElement = '';
                return answers.modifierFor === 'forElement';
            },
            choices: function(answers) {

                var blocksArray,
                    blockPoint,
                    collectionPoint,
                    choicesArray = [];

                if (answers.parentBlock.collectionName === '')  {
                    blocksArray = currentStructure.blocks;
                } else {
                    collectionPoint = currentStructure.collections.filter(function (collection) {
                        return collection.name === answers.parentBlock.collectionName;
                    });
                    blocksArray = collectionPoint[0].blocks;
                }

                blockPoint = blocksArray.filter(function(block) {
                    return block.name === answers.parentBlock.blockName;
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