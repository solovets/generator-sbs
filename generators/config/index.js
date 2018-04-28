'use strict';

const sbs = require('yeoman-generator');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const prompting = require('../../utils/prompting-config');
const namingConventions = require('../../utils/namingConventions');

module.exports = class extends sbs {

    constructor(args, opts) {
        super(args, opts);

        this.option('testmode');

        this.test = !!this.options.testmode;
    }

    prompting() {
        return this.prompt(
            prompting( this.destinationRoot(), this.test )
        ).then(answers => {
            this.answers = answers;
        });
    }

    configuring() {
        const answers = this.answers;
        const props = Object.keys(answers);
        const prefixForElement = namingConventions[answers.namingConvention].prefixForElement;
        const prefixForModifier = namingConventions[answers.namingConvention].prefixForModifier;

        if (this.test) {
            this.testConfig = {};

            props.forEach(prop => {
                this.testConfig[prop] = answers[prop];
            });

            this.testConfig.prefixForElement = prefixForElement;
            this.testConfig.prefixForModifier = prefixForModifier;

        } else {
            props.forEach(prop => {
                this.config.set(prop, answers[prop]);
            });

            this.config.set('prefixForElement', prefixForElement);
            this.config.set('prefixForModifier', prefixForModifier);

            this.config.save();
        }
    }

    writing() {
        const config = this.test ? this.testConfig : this.config.getAll();

        if (config.hasOwnProperty('createBemDirectory') && config.createBemDirectory === true) {
            mkdirp(
                path.join(this.destinationRoot(), config.bemDirectory),
                (error) => {
                    if (error) this.log(error);
                }
            );
        }

        if (config.hasOwnProperty('createRootStylesFile') && config.createRootStylesFile === true) {
            this.fs.copyTpl(
                this.templatePath('root.tmpl'),
                this.destinationPath(path.join(this.destinationRoot(), config.bemDirectory, config.rootStylesFile)),
                {}
            );
        }
    }

    end() {
        this.log('Your config file:');
        this.log(JSON.stringify(this.config.getAll(), null, 4));
        this.log('Now you can use `yo sbs` to create BEM structure for your project');
    }
};