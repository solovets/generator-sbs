'use strict';

const sbs = require('yeoman-generator');
const path = require('path');
const mkdirp = require('mkdirp');

const prompting = require('../../utils/prompting-config');
const namingConventions = require('../../utils/namingConventions');

module.exports = class extends sbs {

    prompting() {
        return this.prompt(
            prompting( this.destinationRoot() )
        ).then(answers => {
            this.answers = answers;
        });
    }

    configuring() {
        const answers = this.answers;
        const props = Object.keys(answers);

        props.forEach(key => {
            this.config.set(key, answers[key]);
        });

        this.config.set('prefixForElement', namingConventions[answers.namingConvention].prefixForElement);
        this.config.set('prefixForModifier', namingConventions[answers.namingConvention].prefixForModifier);

        this.config.save();
    }

    writing() {
        const config = this.config.getAll();

        if (config.hasOwnProperty('createBemDirectory') && config.createBemDirectory === true) {
            mkdirp(
                path.join(this.destinationRoot(), config.bemDirectory),
                (error) => {
                    if (error) this.log(error);
                }
            );
        }

        if (config.createRootStylesFile === true) {
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