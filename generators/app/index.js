'use strict';
var simple_bem = require('yeoman-generator'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    chalk = require('chalk'),
    InjectString = require('inject-string'),

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
                this.prompt(prompting.describeCreatedBlock(generatorConfig, currentStructure, this.answers)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));
            }

            if (this.answers.creatingComponentType === 'element') {
                this.prompt(prompting.describeCreatedElement(generatorConfig, currentStructure, this.answers)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));
            }

            if (this.answers.creatingComponentType === 'modifier') {

                this.prompt(prompting.describeCreatedModifier(generatorConfig, currentStructure, this.answers)).then(function(answers) {
                    this.answers = helpTo.merge(this.answers, answers);
                    done();
                }.bind(this));
            }

        }.bind(this));
    },

    writing: function () {

        log(json(this.answers));

        switch (this.answers.creatingComponentType) {
            case 'element':
                this.answers.creatingComponentName = this.config.get('prefixForElement') + this.answers.creatingComponentName;
                break;
            case 'modifier':
                this.answers.creatingComponentName = this.config.get('prefixForModifier') + this.answers.creatingComponentName;
                break;
        }

        this.answers.fileName = this.answers.creatingComponentName + '.' + this.config.get('ext');

        var config = this.config.getAll(),
            answers = this.answers,
            creatingComponentName = answers.creatingComponentName,
            templatePath = answers.creatingComponentType + '.tmpl',
            root = path.join(this.destinationRoot(), config.bemDirectory),
            destPath,
			component,
            fileName = answers.fileName;

        function getDestPathForBlock() {
            component = path.join(creatingComponentName, fileName);
            return path.join(root, answers.parentCollectionOfBlock, component);
        }

        function getDestPathForElement() {

            component = path.join(creatingComponentName, answers.parentBlockOfElement.blockName + fileName);
            answers.exportTo = path.join(
                root,
                answers.parentBlockOfElement.collectionName,
                answers.parentBlockOfElement.blockName,
                answers.parentBlockOfElement.blockName + '.' + config.ext
            );

            answers.pathToComponent = '';

            return path.join(root, answers.parentBlockOfElement.collectionName, answers.parentBlockOfElement.blockName, component);
        }

        function getDestPathForModifier() {

            answers.pathToComponent = '';

            switch (answers.modifierFor) {
                case 'forBlock':
					answers.exportTo = path.join(
						root,
						answers.parentBlockOfModifier.collectionName,
						answers.parentBlockOfModifier.blockName,
						answers.parentBlockOfModifier.blockName + '.' + config.ext
					);
                    component = path.join(creatingComponentName, answers.parentBlockOfModifier.blockName + fileName);
                    break;
                case 'forElement':
					answers.exportTo = path.join(
						root,
						answers.parentBlockOfModifier.collectionName,
						answers.parentBlockOfModifier.blockName,
						answers.parentElementOfModifier,
						answers.parentElementOfModifier + '.' + config.ext
					);
                    component = path.join(creatingComponentName, answers.parentBlockOfModifier.blockName + answers.parentElementOfModifier + fileName);
                    break;
            }

            return path.join(root, answers.parentBlockOfModifier.collectionName, answers.parentBlockOfModifier.blockName, answers.parentElementOfModifier, component);
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


        if (fs.existsSync(destPath)) {
            log(chalk.red('Error:\n' + destPath + ' already exists'));
            process.exit(1);
        } else {
			this.fs.copyTpl(
				this.templatePath(templatePath),
                this.destinationPath(destPath),
                answers
			);

            fs.readFile(answers.exportTo, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                var content = new InjectString(data, {
                    newlines: true,
                    delimiters: ['//<=', '=>'],
                    tag: 'bem' + helpTo.capitalize(answers.creatingComponentType) + 's'
                });
                content.append('@import "' + path.join(answers.pathToComponent, component).split(path.sep).join('/') + '";');

                fs.writeFileSync(answers.exportTo, content, 'utf8');
            });
        }
    }
});