'use strict';
const sbs = require('yeoman-generator'),
    path = require('path'),
    chalk = require('chalk');

const isBemDirectoryExists = require('../../utils/isBemDirectoryExists'),
    generatorConfigInterface = require('../../utils/generatorConfigInterface');

module.exports = class extends sbs {

    initializing() {

        const config = this.config.getAll(),
            err = chalk.red.bold('Error'),
            ok = chalk.green;
        
        // Check for all needed settings in config

        function checkTypeOfKey (obj, key, objInterface, log) {
            
            const typeInConfig = typeof obj[key];
            const typeInInterface = objInterface[key].type;
            
            if (typeInConfig === typeInInterface) {
                log(ok(key + ' has right type "' + typeInConfig + '"'));
            } else {
                log(err);
                log('Type of ' + key + ' is"' + typeInConfig + '" but should be "' + typeInInterface + '"');
            }

            if (objInterface[key].hasOwnProperty('deps') && obj[key] === true) {

                if (obj[key].hasOwnProperty('deps')) {
                    loopConfigKeys(obj[key].deps, objInterface[key].deps, log);
                } else {
                    log(err);
                    log('Can\'t find ' + Object.keys(objInterface[key].deps).join(', ') + ' in your config');
                }
            }
        }

        function checkIfKeyExists(obj, key, objInterface, log) {
            if (obj.hasOwnProperty(key)) {
                log(ok(key + ' exists'));
                checkTypeOfKey(obj, key, objInterface, log);
            } else {
                log(err);
                log('Can\'t find ' + key + ' in your config');
            }
        }

        function loopConfigKeys(obj, objInterface, log) {
            for (let key in objInterface) {
                checkIfKeyExists(obj, key, objInterface, log);
            }
        }

        loopConfigKeys(config, generatorConfigInterface, this.log);

        // Check if BEM directory exists

        let bemDirPath = path.join(this.destinationRoot(), this.config.get('bemDirectory')),
            bemDirectoryExists = isBemDirectoryExists(bemDirPath);

        if (bemDirectoryExists === true) {
            this.log(ok('Your BEM directory is ' + bemDirPath));
        } else {
            this.log(err);
            this.log(bemDirectoryExists);
        }


    }
};