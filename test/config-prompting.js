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
    intro: 'Whitespaces in inputs and filtered strings replaced with ■',
    head: {
        io: 'Input | Output\n----- | ------\n',
        fv: 'Input | Filtered | Valid\n----- | -------- | -----\n',
    }
};

function showWhitespaces (input) {
    let result;

    if (input === '') {
        result = '_blank_';
    } else {
        result = input.replace(/ /g, '■');
    }

    return result;
}

function putResult(result) {
    let str = '';
    result.forEach((item, index, arr) => {
        let ending = index === arr.length - 1 ? '\n' : ' | ';
        str += item + ending;
    });

    return str;
}

fs.writeFileSync('test/results/config-prompting.md', '', 'utf8');
fs.appendFileSync('test/results/config-prompting.md', '###' + table.title + '\n\n_' + table.intro + '_\n\n', 'utf8');

describe(table.title, () => {

    it('Filter and validate collection suffix', () => {

        let result = '#####Filter and validate collection suffix\n\n';
        result += table.head.fv;

        data.suffixes.forEach((suffix) => {
            let filtered = $$.filterName(null, suffix, 'collection-suffix');
            let validated = $$.validateName(null, filtered, 'collection-suffix');

            result += putResult([showWhitespaces(suffix), showWhitespaces(filtered), validated]);
        });

        fs.appendFileSync('test/results/config-prompting.md', result, 'utf8');
    });

    it('Filter and validate bem directory path', () => {
        let result = '#####Filter and validate bem directory path\n\n';
        result += table.head.fv;

        data.paths.forEach((p) => {
            let filtered = $$.filterName(null, p, 'path');
            let validated = $$.validatePath(filtered);

            result += putResult([showWhitespaces(p), showWhitespaces(filtered), validated]);
        });

        fs.appendFileSync('test/results/config-prompting.md', result, 'utf8');
    });

    it('Filter and validate custom extension input', () => {
        let result = '#####Filter and validate custom extension input\n\n';
        result += table.head.fv;

        data.extensions.forEach((ext) => {
            let filtered = $$.trim(ext, ' .');
            let validated = $$.isAlphanumeric(filtered);

            result += putResult([showWhitespaces(ext), showWhitespaces(filtered), validated]);
        });

        fs.appendFileSync('test/results/config-prompting.md', result, 'utf8');
    });

    it('Test dot() function', () => {
        let result = '#####Test dot() function\n\n';
        result += table.head.io;

        data.dot.forEach(input => {
            let output = $$.dot(input, 'ext');

            result += putResult([input, output]);
        });

        fs.appendFileSync('test/results/config-prompting.md', result, 'utf8');
    });

    it('Filter and validate \"root\" styles file', () => {

        conventions.forEach((convention) => {
            let result = '#####Filter and validate "root" styles file for \"' + convention + '\" convention\n\n';
            result += table.head.fv;

            data.filenames.forEach((filename) => {
                let dotted = $$.dot(filename, 'ext');
                let filtered = $$.filterName(convention, dotted.replace(/\.ext$/, ''), 'root');
                filtered = $$.dot(filtered, 'ext');
                let validated = $$.validateName(convention, filtered.replace(/\.ext$/, ''), 'root');

                result += putResult([showWhitespaces(filename), showWhitespaces(filtered), validated]);
            });

            fs.appendFileSync('test/results/config-prompting.md', result, 'utf8');
        });

        console.log(path.parse('ssd/ext.md'));
        console.log(path.parse('ssd/.md'));
        console.log(path.parse('.md'));
        console.log(path.parse('/d.md'));
        console.log(path.parse('/dr/.md'));
    });

});