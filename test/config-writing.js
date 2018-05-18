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
    title: 'generators/config/index.js :: test of config writing'
};

fs.writeFileSync('test/results/config-writing.md', '', 'utf8');
fs.appendFileSync('test/results/config-prompting.md', '###' + table.title + '\n\n_' + '_\n\n', 'utf8');

describe(table.title, () => {

    it('Create config files', () => {

        data.configs.forEach(config => {
            helpers.run(path.join(__dirname, '../generators/config'))
                .inDir('./some-test-dir')
                .withOptions({ testmode: true })
                .withPrompts(config);
        });

    });

});