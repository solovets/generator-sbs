'use strict';
var simple_bem = require('yeoman-generator'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),

    prompting = require('../../utils/prompting'),
    helpTo = require('../../utils/helpers');
    //existingBlocks = require('../../utils/existing-blocks');

module.exports = simple_bem.Base.extend({
    config: function () {
        this.config.save();
    },
    prompting: function () {

        var prefixFor = {
            element: this.config.get('prefixForElement') || '__',
            modifier: this.config.get('prefixForModifier') || '--'
        },
            useCollections = this.config.get('useCollections') || true,
            bemDir = this.config.get('bemDir') || 'styles',
            bemDirPath = path.join(process.cwd(), bemDir);

        if (fs.existsSync(bemDirPath)) {
            console.log('Your BEM directory is', bemDirPath);

        } else {
            console.log('Can\'t find directory\n' +
                bemDirPath +
                '\nPlease check your settings in .yo-rc.json');
            process.exit(1);
        }

        this.prompt(prompting.defineCreatedComponent(prefixFor.element, prefixFor.modifier, useCollections)).then(function(answers) {

            this.answers = answers;

            if (this.answers.creatingComponentType === 'block' && useCollections) {

                this.prompt(prompting.describeCreatedBlock(prefixFor.element, prefixFor.modifier, useCollections)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                }.bind(this));

            }

            if (this.answers.creatingComponentType === 'element') {

                this.prompt(prompting.describeCreatedElement(prefixFor.element, prefixFor.modifier, useCollections)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                }.bind(this));

            }

            if (this.answers.creatingComponentType === 'modifier') {

                this.prompt(prompting.defineParentBlock(prefixFor.element, prefixFor.modifier, useCollections)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                }.bind(this));

            }

        }.bind(this));
    },

    writing: function () {
        console.log('writing');
    }
});