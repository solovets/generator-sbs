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

    prompting: function () {

        var generatorConfig = this.config.getAll();

        if (!('prefixForElement' in generatorConfig)) {
            this.config.set('prefixForElement', '__');
        }

        if (!('prefixForModifier' in generatorConfig)) {
            this.config.set('prefixForModifier', '--');
        }

        if (!('useCollections' in generatorConfig)) {
            this.config.set('useCollections', true);
        }

        if (!('collectionSuffix' in generatorConfig)) {
            this.config.set('collectionSuffix', '-bem-collection');
        }

        var done = this.async(),
            bemDir = this.config.get('bemDir') || 'styles',
            bemDirPath = path.join(process.cwd(), bemDir);

        generatorConfig = this.config.getAll();

        isBemDirectoryExists(bemDirPath);

        console.log(existingBlocks(bemDirPath));

        this.prompt(prompting.defineCreatedComponent(generatorConfig)).then(function(answers) {

            this.answers = answers;

            if (this.answers.creatingComponentType === 'collection') {
                done();
            }

            if (this.answers.creatingComponentType === 'block') {

                this.prompt(prompting.describeCreatedBlock(generatorConfig)).then(function(answers) {
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
        console.log('write');
        fs.writeFileSync('./test.txt', '123', 'utf8');
    }
});