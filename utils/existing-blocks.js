var fs = require('fs'),
    path = require('path'),
    common = 'common',
    modulesGeneralPath = path.join(process.cwd(), '/dev/app'),
    modulesCommonPath =  path.join(modulesGeneralPath, '/' + common),
    existingBlocks = getExistingBlocks();

function getExistingBlocks() {
    var generalModules = fs.readdirSync(modulesGeneralPath),
        commonModules = fs.readdirSync(modulesCommonPath),
        modules = [],
        index;

    function removeFiles (dest, arr, index) {

        if (fs.lstatSync(path.join(dest, '/' + arr[index])).isDirectory() === false) {
            arr.splice(index, 1);
        }
    }

    if (generalModules.length > 0) {

        for (index = generalModules.length - 1; index >= 0; index--) {

            if (generalModules[index] === common) {
                generalModules.splice(index, 1);
            }
        }
        for (index = generalModules.length - 1; index >= 0; index--) {
            removeFiles(modulesGeneralPath, generalModules, index);
        }
    }

    generalModules.forEach(function(item, i, arr) {
        arr[i] = item.replace(/-module/g, '');
    });

    if (commonModules.length > 0) {
        for (index = commonModules.length - 1; index >= 0; index--) {
            removeFiles(modulesCommonPath, commonModules, index);
        }
    }

    commonModules.forEach(function(item, i, arr) {
        arr[i] = common + '/' + item.replace(/-module/g, '');
    });

    modules = generalModules.concat(commonModules);

    return modules;
}

module.exports = existingBlocks;
