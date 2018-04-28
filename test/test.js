'use strict';
const path = require('path');
const fs = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const to = require('../utils/helpers');
const strings = require('./strings');
const namingConvenions = require('../utils/namingConventions');
const conventions = Object.keys(namingConvenions);

fs.writeFileSync('test/testresults.md', '', 'utf8');

describe('Helpers for sbs:config', () => {

    it('Capitalize first letter of string', () => {
        let testResults = '';
        testResults += '#####utils/ -> helpers.js -> capitalize(string)\n\n';
        testResults += 'Input | Output\n----- | ------\n';

        strings.manipulate.forEach(string => {
            testResults += string + ' | ' + to.capitalize(string) + '\n';
        });

        fs.appendFileSync('test/testresults.md', testResults, 'utf8');
    });

    it('Decapitalize first letter of string', () => {
        let testResults = '';
        testResults += '#####utils/ -> helpers.js -> lowFirstLetter(string)\n\n';
        testResults += 'Input | Output\n----- | ------\n';

        strings.manipulate.forEach(string => {
            testResults += string + ' | ' + to.lowFirstLetter(string) + '\n';
        });

        fs.appendFileSync('test/testresults.md', testResults, 'utf8');
    });

    it('Dasherizes string', () => {
        let testResults = '';
        testResults += '#####utils/ -> helpers.js -> dasherize(string)\n\n';
        testResults += 'Input | Output\n----- | ------\n';

        strings.manipulate.forEach(string => {
            testResults += string + ' | ' + to.dasherize(string) + '\n';
        });

        fs.appendFileSync('test/testresults.md', testResults, 'utf8');
    });

    it('Checks if name is forbidden', () => {
        let testResults = '';
        testResults += '#####utils/ -> helpers.js -> forbiddenFileName(string)\n\n';
        testResults += 'Input | Output\n----- | ------\n';

        strings.nameValidation.forEach(string => {
            testResults += string + ' | ' + (to.forbiddenFileName(string) ? 'forbidden' : 'ok') + '\n';
        });

        fs.appendFileSync('test/testresults.md', testResults, 'utf8');
    });

    it('Filters root style file name', () => {

        conventions.forEach((convention) => {
            let testResults = '';
            testResults += '#####utils/ -> helpers.js -> filterName("' + convention + '", input, type)\n\n';
            testResults += 'Input | Output\n----- | ------\n';

            strings.manipulate.forEach((string) => {
                testResults += string + ' | ' + to.filterName(convention, string, 'root') + '\n';
            });

            fs.appendFileSync('test/testresults.md', testResults, 'utf8');
        });


    });

    it('Validates collection suffix', () => {

        strings.suffixes.forEach((suffix) => {
            let testResults = '';

            // filter
            suffix = _.trim(suffix);
            suffix = '--' + _.trim(suffix, '-_');

            testResults += '#####utils/ -> helpers.js -> filterName("' + convention + '", input, type)\n\n';
            testResults += 'Input | Output\n----- | ------\n';

            strings.manipulate.forEach((string) => {
                testResults += string + ' | ' + to.filterName(convention, string, 'root') + '\n';
            });

            fs.appendFileSync('test/testresults.md', testResults, 'utf8');
        });


    });


});
