'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('underscore.string');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const $$ = require('../utils/helpers');
const data = require('./strings');
const namingConvenions = require('../utils/namingConventions');
const conventions = Object.keys(namingConvenions);
const prepareTestDir = require('../utils/test/prepare-test-dir');

const testConfiguration = {
    "namingConvention": "classic",
    "useCollections": true,
    "collectionSuffix": "--bem-collection",
    "createBemDirectory": true,
    "bemDirectory": path.normalize('./test/results/sbs/styles'),
    "ext": "scss",
    "createRootStylesFile": true,
    "rootStylesFile": "styles.scss",
    "prefixForElement": "__",
    "prefixForModifier": "_"
};

describe('generators/sbs/index.js :: test of creating blocks, elements, modifiers', () => {

    it('Prepare test directory', () => {
        
        prepareTestDir(testConfiguration.bemDirectory);
        fs.copyFileSync(
            path.join(__dirname, '../generators/config/templates/root.tmpl'),
            path.join(__dirname, 'results/sbs/styles', testConfiguration.rootStylesFile)
        );
    });

    it('Create block', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "block",
                "creatingComponentName": "block-name",
                "putBlockInCollection": false
            });

    });

    it('Create block in collection', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "block",
                "creatingComponentName": "block-name",
                "putBlockInCollection": true,
                "parentCollectionOfBlock": "collection--bem-collection"
            });

    });

    it('Create element', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "element",
                "creatingComponentName": "element-name",
                "parentBlock": {
                    "blockName": "block-name",
                    "collectionName": ""
                }
            });

    });

    it('Create element of block in collection', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "element",
                "creatingComponentName": "element-name",
                "parentBlock": {
                    "blockName": "block-name",
                    "collectionName": "collection--bem-collection"
                }
            });

    });

    it('Create modifier for block', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "modifier",
                "creatingComponentName": "modifier-name",
                "modifierFor": "forBlock",
                "parentBlock": {
                    "blockName": "block-name",
                    "collectionName": ""
                },
                "parentElement": ""
            });

    });

    it('Create modifier for block in collection', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "modifier",
                "creatingComponentName": "modifier-name",
                "modifierFor": "forBlock",
                "parentBlock": {
                    "blockName": "block-name",
                    "collectionName": "collection--bem-collection"
                },
                "parentElement": ""
            });

    });

    it('Create modifier for element', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "modifier",
                "creatingComponentName": "modifier-name",
                "modifierFor": "forElement",
                "parentBlock": {
                    "blockName": "block-name",
                    "collectionName": ""
                },
                "parentElement": "__element-name"
            });

    });

    it('Create modifier for element in collection', () => {

        return helpers.run(path.join(__dirname, '../generators/app'))
            .inDir('./some-test-dir')
            .withOptions({
                testmode: true,
                testConfiguration: testConfiguration
            })
            .withPrompts({
                "creatingComponentType": "modifier",
                "creatingComponentName": "modifier-name",
                "modifierFor": "forElement",
                "parentBlock": {
                    "blockName": "block-name",
                    "collectionName": "collection--bem-collection"
                },
                "parentElement": "__element-name"
            });

    });

    
});