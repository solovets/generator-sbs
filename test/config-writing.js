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

const table = {
    title: 'generators/config/index.js :: test of creating of base structure'
};

describe(table.title, () => {

    it('Create bemDirectory and rootStyleFile', () => {

        return helpers.run(path.join(__dirname, '../generators/config'))
            .inDir('./some-test-dir')
            .withOptions({ testmode: true })
            .withPrompts({
                "namingConvention": "classic",
                "useCollections": false,
                "createBemDirectory": true,
                "bemDirectory": path.normalize('test/results/configs/dir-should-be-created'),
                "ext": "scss",
                "createRootStylesFile": true,
                "rootStylesFile": "file-should-be-created.scss",
                "prefixForElement": "__",
                "prefixForModifier": "_"
            });

    });

    it('Create rootStyleFile (bemDirectory exists)', () => {

        return helpers.run(path.join(__dirname, '../generators/config'))
            .inDir('./some-test-dir')
            .withOptions({ testmode: true })
            .withPrompts({
                "namingConvention": "classic",
                "useCollections": false,
                "createBemDirectory": false,
                "bemDirectory": path.normalize('test/results/configs/dir-exists'),
                "ext": "scss",
                "createRootStylesFile": true,
                "rootStylesFile": "file-should-be-created.scss",
                "prefixForElement": "__",
                "prefixForModifier": "_"
            });

    });
});