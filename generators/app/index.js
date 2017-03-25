'use strict';
var simple_bem = require('yeoman-generator'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),

    prompting = require('../../utils/prompting'),
    helpTo = require('../../utils/helpers'),
    isBemDirectoryExists = require('../../utils/isBemDirectoryExists'),
    existingBlocks = require('../../utils/existing-blocks');

module.exports = simple_bem.Base.extend({
    config: function () {
        this.config.save();
    },
    prompting: function () {

        var prefixForElement = this.config.get('prefixForElement') || '__',
            prefixForModifier = this.config.get('prefixForModifier') || '--',
            useCollections = this.config.get('useCollections') || true,
            bemDir = this.config.get('bemDir') || 'styles',
            bemDirPath = path.join(process.cwd(), bemDir);

        isBemDirectoryExists(bemDirPath);


        console.log(existingBlocks(bemDirPath));

        this.prompt(prompting.defineCreatedComponent(prefixForElement, prefixForModifier, useCollections)).then(function(answers) {

            this.answers = answers;

            if (this.answers.creatingComponentType === 'block' && useCollections) {

                this.prompt(prompting.describeCreatedBlock(prefixForElement, prefixForModifier, useCollections)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                }.bind(this));

            }

            if (this.answers.creatingComponentType === 'element') {

                this.prompt(prompting.describeCreatedElement(prefixForElement, prefixForModifier, useCollections)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                }.bind(this));

            }

            if (this.answers.creatingComponentType === 'modifier') {

                this.prompt(prompting.describeCreatedModifier(prefixForElement, prefixForModifier, useCollections)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                }.bind(this));

            }

        }.bind(this));
    },

    writing: function () {
        console.log('writing');
    }
});