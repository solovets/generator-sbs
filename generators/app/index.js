'use strict';
var sbs = require('yeoman-generator'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    chalk = require('chalk'),
    InjectString = require('inject-string'),

    prompting = require('../../utils/sbs/prompting'),
    $$ = require('../../utils/helpers'),
    getCurrentStructure = require('../../utils/current-structure');

module.exports = class extends sbs {

    constructor(args, opts) {
        super(args, opts);

        this.option('testmode');

        this.test = !!this.options.testmode;

        if (this.test) this.testConfiguration = this.options.testConfiguration;
    }

    prompting() {

        const  config = this.test ? this.testConfiguration : this.config.getAll(),
            bemDirPath = path.join(this.destinationRoot(), config.bemDirectory),
            currentStructure = getCurrentStructure(config, bemDirPath),
            done = this.async();

        this.prompt(prompting.defineCreatedComponent(config)).then((answers) => {

            this.answers = answers;
            let describe = 'describeCreated' + $$.capitalize(this.answers.creatingComponentType);

            this.prompt(prompting[describe](config, currentStructure, this.answers)).then((answers) => {
                this.answers = $$.merge(this.answers, answers);
                done();
            });
        });
    }

    configuring() {

        // add prefix for element or modifier
        if (this.answers.creatingComponentType !== 'block') {
            let prefixFor = this.config.get('prefixFor' + $$.capitalize(this.answers.creatingComponentType));
            this.answers.creatingComponentName = prefixFor + this.answers.creatingComponentName;
        }

        // just to make code more readable
        this.answers.componentDir = this.answers.creatingComponentName;

        // filename with extension
        this.answers.creatingComponentFileBase = $$.dot(this.answers.creatingComponentName, this.config.get('ext'));
        
        // put empty string as value for parentCollectionOfBlock if block doesn't have parent collection
        if (this.answers.hasOwnProperty('parentCollectionOfBlock') === false) {
            this.answers.parentCollectionOfBlock = '';
        }
    }

    writing() {

        const  config = this.test ? this.testConfiguration : this.config.getAll(),
            answers = this.answers,
            templatePath = this.answers.creatingComponentType + '.tmpl',
            root = path.join(this.destinationRoot(), config.bemDirectory);

        let result = {
            collection: '',
            file: '',
            export: '',
            path: ''

        };

       this.log($$.json(answers));

        function getDestPathForBlock() {

            return {
                collection: answers.parentCollectionOfBlock,
                file: answers.creatingComponentName,
                export: path.join(root, config.rootStylesFile),
                path: path.join(
                    root,
                    answers.parentCollectionOfBlock,
                    answers.componentDir,
                    answers.creatingComponentFileBase
                )
            };
        }

        function getDestPathForElement() {

            return {
                collection: '',
                file: answers.parentBlock.blockName + answers.creatingComponentName,
                export: path.join(
                    root,
                    answers.parentBlock.collectionName,
                    answers.parentBlock.blockName,
                    $$.dot(answers.parentBlock.blockName, config.ext)
                ),
                path: path.join(
                    root,
                    answers.parentBlock.collectionName,
                    answers.parentBlock.blockName,
                    answers.componentDir,
                    answers.parentBlock.blockName + answers.creatingComponentFileBase
                )
            };
        }

        function getDestPathForModifier() {

            return {
                collection: '',
                file: answers.parentBlock.blockName + answers.parentElement + answers.creatingComponentName,
                export: path.join(
                    root,
                    answers.parentBlock.collectionName,
                    answers.parentBlock.blockName,
                    answers.parentElement,
                    $$.dot(answers.parentBlock.blockName + (!!answers.parentElement ? answers.parentElement : ''), config.ext)
                ),
                path: path.join(
                    root,
                    answers.parentBlock.collectionName,
                    answers.parentBlock.blockName,
                    answers.parentElement,
                    answers.componentDir,
                    answers.parentBlock.blockName + answers.parentElement + answers.creatingComponentFileBase
                )
    
            };
        }

        switch (answers.creatingComponentType) {
            case 'block':
                result = getDestPathForBlock();
                break;
            case 'element':
                result = getDestPathForElement();
                break;
            case 'modifier':
                result = getDestPathForModifier();
                break;
        }


        if (fs.existsSync(result.path)) {
            this.log(chalk.red('Error:\n' + result.path + ' already exists'));
            process.exit(1);
        } else {
			this.fs.copyTpl(
				this.templatePath(templatePath),
                this.destinationPath(result.path),
                answers
            );
            
            fs.readFile(result.export, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                let content = new InjectString(data, {
                    newlines: true,
                    delimiters: ['//<=', '=>'],
                    tag: 'bem' + $$.capitalize(answers.creatingComponentType) + 's'
                });
                content.append('@import "' + path.join(
                    result.collection,
                    answers.componentDir,
                    result.file
                ).split(path.sep).join('/') + '";');

                fs.writeFileSync(result.export, content, 'utf8');
            });
        }
    }
};