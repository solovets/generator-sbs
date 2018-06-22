'use strict';
var sbs = require('yeoman-generator'),
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

    prompting = require('../../utils/prompting-sbs'),
    $$ = require('../../utils/helpers'),
    isBemDirectoryExists = require('../../utils/isBemDirectoryExists'),
    getCurrentStructure = require('../../utils/current-structure'),
    generatorConfigInterface = require('../../utils/generatorConfigInterface');

module.exports = class extends sbs ({

    initializing() {

        var currentConfig = this.config.getAll(),
            bemDirPath,
            bemDirectoryExists;

        // Check for all needed settings

        for (let configKey in generatorConfigInterface) {

            if (currentConfig.hasOwnProperty(configKey) === false) {

            }
        }

        generatorConfigInterface.some(function (key) {
            if (currentConfig.hasOwnProperty(key) === false) {
                this.log('Can\'t find key ' +  key + ' in your config.');
                this.log('You can run yo sbs:config to set prefered settings.');
                process.exit(1);
            }
        });

        // Check if BEM directory exists

        bemDirPath = path.join(this.destinationRoot(), this.config.get('bemDirectory'));
        bemDirectoryExists = isBemDirectoryExists(bemDirPath);

        if (bemDirectoryExists === true) {
            log('Your BEM directory is ' + bemDirPath);
        } else {
            log(bemDirectoryExists);
            log('You can run yo sbs:config to set prefered settings.');
            process.exit(1);
        }


    }

    prompting() {

        var generatorConfig = this.config.getAll(),
            bemDirPath = path.join(this.destinationRoot(), generatorConfig.bemDirectory),
            currentStructure = getCurrentStructure(generatorConfig, bemDirPath),
            done = this.async();

        this.prompt(prompting.defineCreatedComponent(generatorConfig)).then(function(answers) {

            this.answers = answers;

            if (this.answers.creatingComponentType === 'block') {
                this.prompt(prompting.describeCreatedBlock(generatorConfig, currentStructure, this.answers)).then(function(answers) {
                    this.answers = $$.merge(this.answers, answers);
                    done();
                }.bind(this));
            }

            if (this.answers.creatingComponentType === 'element') {
                this.prompt(prompting.describeCreatedElement(generatorConfig, currentStructure, this.answers)).then(function(answers) {
                    this.answers = $$.merge(this.answers, answers);
                    done();
                }.bind(this));
            }

            if (this.answers.creatingComponentType === 'modifier') {

                this.prompt(prompting.describeCreatedModifier(generatorConfig, currentStructure, this.answers)).then(function(answers) {
                    this.answers = $$.merge(this.answers, answers);
                    done();
                }.bind(this));
            }

        }.bind(this));
    }

    configuring() {
        switch (this.answers.creatingComponentType) {
            case 'element':
                this.answers.creatingComponentName = this.config.get('prefixForElement') + this.answers.creatingComponentName;
                break;
            case 'modifier':
                this.answers.creatingComponentName = this.config.get('prefixForModifier') + this.answers.creatingComponentName;
                break;
        }

        this.answers.componentFileName = this.answers.creatingComponentName + '.' + this.config.get('ext');
        this.answers.componentDir = this.answers.creatingComponentName;
        this.answers.pathToComponent = '';
        if (this.answers.hasOwnProperty('parentCollectionOfBlock') === false) {
            this.answers.parentCollectionOfBlock = '';
        }
    }

    writing() {
        var config = this.config.getAll(),
            answers = this.answers,
            templatePath = this.answers.creatingComponentType + '.tmpl',
            root = path.join(this.destinationRoot(), config.bemDirectory),
            destPath,
			component;

        log(json(answers));

        function getDestPathForBlock() {
            answers.pathToComponent = answers.parentCollectionOfBlock;

            answers.exportTo = path.join(root, config.rootStylesFile);

            component = path.join(answers.componentDir, answers.componentFileName);
            return path.join(root, answers.parentCollectionOfBlock, component);
        }

        function getDestPathForElement() {

            component = path.join(answers.componentDir, answers.parentBlock.blockName + answers.componentFileName);

            answers.exportTo = path.join(
                root,
                answers.parentBlock.collectionName,
                answers.parentBlock.blockName,
                answers.parentBlock.blockName + '.' + config.ext
            );

            return path.join(root, answers.parentBlock.collectionName, answers.parentBlock.blockName, component);
        }

        function getDestPathForModifier() {

            switch (answers.modifierFor) {
                case 'forBlock':
					answers.exportTo = path.join(
						root,
						answers.parentBlock.collectionName,
						answers.parentBlock.blockName,
						answers.parentBlock.blockName + '.' + config.ext
					);
                    component = path.join(answers.componentDir, answers.parentBlock.blockName + answers.componentFileName);
                    break;
                case 'forElement':
					answers.exportTo = path.join(
						root,
						answers.parentBlock.collectionName,
						answers.parentBlock.blockName,
						answers.parentElement,
						answers.parentElement + '.' + config.ext
					);
                    component = path.join(answers.componentDir, answers.parentBlock.blockName + answers.parentElement + answers.componentFileName);
                    break;
            }

            return path.join(root, answers.parentBlock.collectionName, answers.parentBlock.blockName, answers.parentElement, component);
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
                    tag: 'bem' + $$.capitalize(answers.creatingComponentType) + 's'
                });
                content.append('@import "' + path.join(answers.pathToComponent, component).split(path.sep).join('/') + '";');

                fs.writeFileSync(answers.exportTo, content, 'utf8');
            });
        }
    }
});