var path = require('path');
const cEnum = require('../components-emuns');
var $$ = require('../helpers');
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

    currentStructure.blocks.forEach((block) => {
        choicesArray.push({
            name: block.name,
            value: {
                blockName: block.name,
                collectionName: ''
            }
        });
    });

    if (useCollections) {
        currentStructure.collections.forEach((collection) => {
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
                    name: cEnum.props[1].name,
                    value: 'block'
                },
                {
                    name: generatorConfig.prefixForElement + cEnum.props[2].name,
                    value: 'element'
                },
                {
                    name: generatorConfig.prefixForModifier + cEnum.props[3].name,
                    value: 'modifier'
                }
            ]
        },
        {
            type: 'input',
            name: 'creatingComponentName',
            message: 'Please define name:',
            filter: (input, answers) => {
                return $$.filterName(generatorConfig.namingConvention, input, answers.creatingComponentType);
            },
            validate: (input, answers) => {
                return $$.validateName(generatorConfig.namingConvention, input, answers.creatingComponentType);
            }
        }
    ];
}

function describeCreatedBlock(generatorConfig, currentStructure, previousAnswers) {

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
            when: (answers) => {
                return answers.putBlockInCollection;
            },
            choices: () => {
                let choicesArray = [];

                currentStructure.collections.forEach((collection) => {
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
            when: (answers) => {
                return answers.parentCollectionOfBlock === false;
            },
            message: 'Please define collection\'s name, suffix ' + generatorConfig.collectionSuffix + ' will be added automatically',
            filter: (input) => {
                input = input.replace(new RegExp(generatorConfig.collectionSuffix + '$', 'i'), '');
                input = _.ltrim(input);
                input = _.rtrim(input, '-_');

                return input;
            },
            validate: (input, answers) => {
                var valid = $$.validateName(generatorConfig.namingConvention, input, null, null);

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
            message: (answers) => {
                let str = 'Block';

                if (answers.modifierFor === 'forElement') {
                    str += ' that contains ' + generatorConfig.prefixForElement + 'element';
                } else {
                    str += ' to modify';
                }

                return str;
            },
            choices: getBlocks(currentStructure, generatorConfig.useCollections)
        },
        {
            type: 'list',
            name: 'parentElement',
            message: 'Please define parent ' + generatorConfig.prefixForElement + 'element of ' + generatorConfig.prefixForModifier + 'modifier',
            when: (answers) => {
				answers.parentElement = '';
                return answers.modifierFor === 'forElement';
            },
            choices: (answers) => {

                var blocksArray,
                    blockPoint,
                    collectionPoint,
                    choicesArray = [];

                if (answers.parentBlock.collectionName === '')  {
                    blocksArray = currentStructure.blocks;
                } else {
                    collectionPoint = currentStructure.collections.filter((collection) => {
                        return collection.name === answers.parentBlock.collectionName;
                    });
                    blocksArray = collectionPoint[0].blocks;
                }

                blockPoint = blocksArray.filter((block) => {
                    return block.name === answers.parentBlock.blockName;
                });

                blockPoint[0].elements.forEach((element) => {
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