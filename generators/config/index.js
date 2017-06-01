'use strict';
var simple_bem = require('yeoman-generator'),
    async = require('async'),
    namingConventions = require('../../utils/namingConventions'),
    prompting = require('../../utils/configPrompting'),
    log = console.log,
    json = function (obj) {
        return JSON.stringify(obj, null, 4);
    };

module.exports = simple_bem.Base.extend({

    prompting: function () {

        var done = this.async();

        this.prompt(prompting(this.destinationRoot())).then(function(answers) {

            this.answers = answers;
            done();

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
    }
});