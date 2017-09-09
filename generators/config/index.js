'use strict';

var sbs = require('yeoman-generator'),
    async = require('async'),
    path = require('path'),
    mkdirp = require('mkdirp'),

    helpTo = require('../../utils/helpers.js'),
    namingConventions = require('../../utils/namingConventions'),
    prompting = require('../../utils/prompting-config'),

    log = console.log,
    json = function (obj) {
        return JSON.stringify(obj, null, 4);
    };

module.exports = sbs.Base.extend({

    prompting: function () {

        var done = this.async();

        this.prompt(prompting.general(this.destinationRoot())).then(function(answers) {

            this.answers = answers;

            this.prompt(prompting.rootStyles(this.destinationRoot(), this.answers)).then(function(answers) {
                this.answers = helpTo.merge(this.answers, answers);
                done();
            }.bind(this));

        }.bind(this));
    },

    configuring: function () {
        var answers = this.answers,
            definedConfiguration = Object.keys(answers);

        definedConfiguration.forEach(function (key) {
            this.config.set(key, answers[key]);
        }, this);

        this.config.set('prefixForElement', namingConventions[answers.namingConvention].prefixForElement);
        this.config.set('prefixForModifier', namingConventions[answers.namingConvention].prefixForModifier);

        this.config.save();
    },

    writing: function () {
        log('Your configuration object: ');
        log(json(this.config.getAll()));

        var config = this.config.getAll();

        if (config.hasOwnProperty('createBemDirectory') && config.createBemDirectory === true) {
            mkdirp(path.join(this.destinationRoot(), config.bemDirectory), function (error) {
                if (error) {
                    log(error);
                }
            });
        }

        if (config.createRootStylesFile === true) {
            this.fs.copyTpl(
                this.templatePath('root.tmpl'),
                this.destinationPath(path.join(this.destinationRoot(), config.bemDirectory, config.rootStylesFile)),
                {}
            );
        }

    }
});