'use strict';
var simple_bem = require('yeoman-generator'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mkdirp = require('mkdirp'),

    log = console.log,
    json = function (obj) {
        return JSON.stringify(obj, null, 4);
    },

    prompting = require('../../utils/prompting'),
    helpTo = require('../../utils/helpers'),
    isBemDirectoryExists = require('../../utils/isBemDirectoryExists'),
    getCurrentStructure = require('../../utils/current-structure'),
    generatorConfigDefaults = require('../../utils/generatorConfigDefaults'),
    namingConvention = require('../../utils/namingConventions');

module.exports = simple_bem.Base.extend({

    prompting: function () {

        var generatorConfig = this.config.getAll(),
            generatorConfigKeys = Object.keys(generatorConfigDefaults);

        log(json(generatorConfig));

        generatorConfigKeys.forEach(function(item) {
            if (generatorConfig.hasOwnProperty(item) === false) {
                this.config.set(item, generatorConfigDefaults[item]);
            }
        }, this);

        var done = this.async(),
            bemDirPath = path.join(this.destinationRoot(), this.config.get('bemDirectory')),
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

                this.prompt(prompting.describeCreatedElement(generatorConfig, currentStructure)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));

            }

            if (this.answers.creatingComponentType === 'modifier') {

                this.prompt(prompting.describeCreatedModifier(generatorConfig, currentStructure)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));

            }
        }.bind(this));
    },

    writing: function () {

        var config = this.config.getAll(),
            prefixForElement = config.prefixForElement,
            prefixForModifier = config.prefixForModifier,
            answers = this.answers,
            creatingComponentName = answers.creatingComponentName,
            templatePath = answers.creatingComponentType + '.tmpl',
            root = path.join(this.destinationRoot(), config.bemDirectory),
            destPath,
            ext = '.' + config.ext;
        
        function getDestPathForBlock() {

            var destPathForBlock,
                blockDir = path.join(creatingComponentName, creatingComponentName + ext);

            if (answers.putBlockInCollection) {

                if (answers.parentCollectionOfBlock === false) {
                    answers.parentCollectionOfBlock = answers.newParentCollectionOfBlock + config.collectionSuffix;
                    mkdirp.sync(path.join(root, answers.parentCollectionOfBlock));
                }

                destPathForBlock = path.join(root, answers.parentCollectionOfBlock, blockDir);
            } else {
                destPathForBlock = path.join(root, blockDir);
            }
            return destPathForBlock;
        }

        function getDestPathForElement() {

            creatingComponentName = prefixForElement + creatingComponentName;
            answers.creatingComponentName = creatingComponentName;

            var elementDir = path.join(creatingComponentName, answers.parentBlockOfElement.blockName + creatingComponentName + ext);

            return path.join(root, answers.parentBlockOfElement.collectionName, answers.parentBlockOfElement.blockName, elementDir);;
        }

        function getDestPathForModifier() {

            creatingComponentName = prefixForModifier + creatingComponentName;
            answers.creatingComponentName = creatingComponentName;

            var modifierDir;

            switch (answers.modifierFor) {
                case 'forBlock':
                    modifierDir = path.join(creatingComponentName, answers.parentBlockOfModifier.blockName + creatingComponentName + ext);
                    break;
                case 'forElement':
                    modifierDir = path.join(creatingComponentName, answers.parentBlockOfModifier.blockName + answers.parentElementOfModifier + creatingComponentName + ext);
                    break;
            }

            return path.join(root, answers.parentBlockOfModifier.collectionName, answers.parentBlockOfModifier.blockName, modifierDir);
        }

        switch (answers.creatingComponentType) {
            case 'block':
                destPath = getDestPathForBlock();
                break;
            case 'element':
                destPath = getDestPathForElement();
                break;
            case 'modifier':
                destPath = getDestPathForModifier();
                break;
        }


        log(json(answers));

        this.fs.copyTpl(
            this.templatePath(templatePath),
            this.destinationPath(destPath),
            answers
        );
    }
});