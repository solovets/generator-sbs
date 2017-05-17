'use strict';
var simple_bem = require('yeoman-generator'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),

    log = console.log,
    json = function (obj) {
        return JSON.stringify(obj, null, 4);
    },

    prompting = require('../../utils/prompting'),
    helpTo = require('../../utils/helpers'),
    isBemDirectoryExists = require('../../utils/isBemDirectoryExists'),
    getCurrentStructure = require('../../utils/current-structure'),
    generatorConfigDefaults = require('../../utils/generatorConfigDefaults');

module.exports = simple_bem.Base.extend({

    prompting: function () {

        var generatorConfig = this.config.getAll(),
            generatorConfigKeys = Object.keys(generatorConfigDefaults);

        generatorConfigKeys.forEach(function(item, index, array) {
            if (generatorConfig.hasOwnProperty(item) === false) {
                console.log('empty');
                this.config.set(item, generatorConfigDefaults[item]);
            }
        }, this);

        this.config.save();

        var done = this.async(),
            bemDirPath = path.join(process.cwd(), this.config.get('bemDirectory')),
            currentStructure;


        generatorConfig = this.config.getAll();
        isBemDirectoryExists(bemDirPath);
        currentStructure = getCurrentStructure(generatorConfig, bemDirPath);

        this.prompt(prompting.defineCreatedComponent(generatorConfig)).then(function(answers) {

            this.answers = answers;

            if (this.answers.creatingComponentType === 'block') {

                this.prompt(prompting.describeCreatedBlock(generatorConfig, currentStructure)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));

            }

            if (this.answers.creatingComponentType === 'element') {

                this.prompt(prompting.describeCreatedElement(generatorConfig)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));

            }

            if (this.answers.creatingComponentType === 'modifier') {

                this.prompt(prompting.describeCreatedModifier(generatorConfig)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));

            }
        }.bind(this));
    },

    writing: function () {
        console.log( JSON.stringify(this.answers, null, 4) );
    }
});