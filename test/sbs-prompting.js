'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('underscore.string');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const $$ = require('../utils/helpers');
const data = require('./strings');
const cEnum = require('../utils/components-emuns');
const namingConvenions = require('../utils/namingConventions');
const conventions = Object.keys(namingConvenions);

let components = [];

for (let eNum in cEnum.props) {
    components.push(cEnum.props[eNum].name);
}

const table = {
    title: 'utils/sbs/prompting.js',
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

fs.writeFileSync('test/results/sbs-prompting.md', '', 'utf8');
fs.appendFileSync('test/results/sbs-prompting.md', '###' + table.title + '\n\n_' + table.intro + '_\n\n', 'utf8');

describe(table.title, () => {

    it('Filter and validate collection suffix', () => {

        conventions.forEach((convention) => {

            for (let component = 0; component < components.length; component++) {

                let result = '#####Filter and validate creating ' + components[component] +
                    ' name for \"' + convention + '\" convention\n\n';
                result += table.head.fv;

                data.componentName.forEach((name) => {
                    let filtered = $$.filterName(convention, name, components[component]);
                    let validated = $$.validateName(convention, filtered, components[component]);

                    result += putResult([showWhitespaces(name), showWhitespaces(filtered), validated]);
                });

                fs.appendFileSync('test/results/sbs-prompting.md', result, 'utf8');

            }

        });
    });

    

});