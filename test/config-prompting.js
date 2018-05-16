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
    title: 'utils/config/prompting.js :: filters and validation',
    head: 'Input | Filtered | Valid\n----- | -------- | -----\n'
};

fs.writeFileSync('test/results/config-prompting.md', '', 'utf8');
fs.appendFileSync('test/results/config-prompting.md', '###' + table.title + '\n\n', 'utf8');

describe(table.title, () => {

    it('Filter and validate collection suffix', () => {

        let result = '';
        result += '#####Filter and validate collection suffix\n\n';
        result += table.head;

        data.suffixes.forEach((suffix) => {
            let i = _.isBlank(suffix) ? '_whitespace(s)_' : suffix;
            let f = $$.filterName(null, suffix, 'collection-suffix');
            let v = $$.validateName(null, f, 'collection-suffix');

            result += i + ' | ' + f + ' | ' + v + '\n';
        });

        fs.appendFileSync('test/results/config-prompting.md', result, 'utf8');
    });

    it('Filter and validate bem directory path', () => {
        let result = '';
        result += '#####Filter and validate bem directory path\n\n';
        result += table.head;

        data.paths.forEach((p) => {
            let i = _.isBlank(p) ? '_whitespace(s)_' : p;
            let f = $$.filterName(null, p, 'path');
            let v = $$.validatePath(f);

            result += i + ' | ' + f + ' | ' + v + '\n';
        });

        fs.appendFileSync('test/results/config-prompting.md', result, 'utf8');
    });

});