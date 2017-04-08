var fs = require('fs'),
    path = require('path'),
    common = 'common',
    modulesGeneralPath = path.join(process.cwd(), '/dev/app'),
    modulesCommonPath = path.join(modulesGeneralPath, '/' + common),
    existingBlocks = getExistingBlocks;

var count = 0,
    obj = {};

function readTree() {
    return 'word';
}

function keepOnlyDirs(array, parent) {

    var i;
    if (array.length > 0) {
        for (i in array) {
            if (array.hasOwnProperty(i)) {
                if (fs.lstatSync(path.join(parent, array[i])).isDirectory() !== true) {
                    array.splice(i, 1);
                }
            }
        }
    }
    return array;
}

function looksLikeBlock(name, prefixForElement, prefixForModifier) {
    return !(new RegExp('^' + prefixForElement).test(name)) && !(new RegExp('^' + prefixForModifier).test(name));
}

function buildTree(generatorConfig, treeObject, dirPath, point, callback) {
    console.log(count);
    count++;

    var dirContent = fs.readdirSync(dirPath),
        i;

    dirContent = keepOnlyDirs(dirContent, dirPath);

    if (count === 1 || count === 2) {
        for (i in dirContent) {
            if (dirContent.hasOwnProperty(i)) {
                if (new RegExp('.+' + generatorConfig.collectionSuffix + '$').test(dirContent[i]) && generatorConfig.useCollections && count === 1) {
                    obj.collections.push({
                        name: dirContent[i],
                        blocks: []
                    });
                } else if (looksLikeBlock(dirContent[i], generatorConfig.prefixForElement, generatorConfig.prefixForModifier)) {
                    obj.blocks.push({
                        name: dirContent[i]
                    });
                }
            }
        }
    }

    if (obj.collections.length > 0) {
        for (i in obj.collections) {
            if (obj.collections.hasOwnProperty(i)) {
                buildTree(generatorConfig, obj, path.join(dirPath, obj.collections[i]), obj.collections[i], readTree);
            }
        }
    }


    count--;

    if ((count === 0 || count === 4) && callback) {
        callback();
    }
}

function getExistingBlocks(generatorConfig, bemDirPath) {

    obj[generatorConfig.bemDirectory] = {
        blocks: [],
        collections: []
    };

    buildTree(generatorConfig, obj, bemDirPath, generatorConfig.bemDirectory, readTree);

    // var dirContains = fs.readdirSync(bemDirPath);
    // var dirContainsBlocks = [];
    // var dirContainsCollections = [];
    // var i;
    //
    //
    // // keep only directories in array
    // for (i in dirContains) {
    //     if (dirContains.hasOwnProperty(i)) {
    //         if (fs.lstatSync(path.join(bemDirPath, dirContains[i])).isDirectory() !== true) {
    //             dirContains.splice(i, 1);
    //         } else {
    //             if (/.+-bem-collection$/.test(dirContains[i]) && generatorConfig.useCollections) {
    //                 dirContainsCollections.push(dirContains[i]);
    //             } else {
    //                 dirContainsBlocks.push(dirContains[i]);
    //             }
    //         }
    //     }
    // }
    //
    // var collectionContains, item;
    //
    // if (generatorConfig.useCollections && dirContainsCollections.length > 0) {
    //     for (i in dirContainsCollections) {
    //         if (dirContainsCollections.hasOwnProperty(i)) {
    //             collectionContains = fs.readdirSync(path.join(bemDirPath, dirContainsCollections[i]));
    //
    //             for (item in collectionContains) {
    //                 if (fs.lstatSync(path.join(bemDirPath, dirContainsCollections[i], collectionContains[i])).isDirectory()) {
    //                     dirContainsBlocks.push(collectionContains[item] + ' in collection ' + dirContainsCollections[i]);
    //                 }
    //             }
    //         }
    //     }
    // }
    //
    // console.log('all ', dirContains.join(','));
    // console.log('blocks ', dirContainsBlocks.join(','));
    // console.log('collections ', dirContainsCollections.join(','));


    // var generalModules = fs.readdirSync(modulesGeneralPath);
    //     commonModules = fs.readdirSync(modulesCommonPath),
    //     modules = [],
    //     index;
    //
    // function removeFiles (dest, arr, index) {
    //
    //     if (fs.lstatSync(path.join(dest, '/' + arr[index])).isDirectory() === false) {
    //         arr.splice(index, 1);
    //     }
    // }
    //
    // if (generalModules.length > 0) {
    //
    //     for (index = generalModules.length - 1; index >= 0; index--) {
    //
    //         if (generalModules[index] === common) {
    //             generalModules.splice(index, 1);
    //         }
    //     }
    //     for (index = generalModules.length - 1; index >= 0; index--) {
    //         removeFiles(modulesGeneralPath, generalModules, index);
    //     }
    // }
    //
    // generalModules.forEach(function(item, i, arr) {
    //     arr[i] = item.replace(/-module/g, '');
    // });
    //
    // if (commonModules.length > 0) {
    //     for (index = commonModules.length - 1; index >= 0; index--) {
    //         removeFiles(modulesCommonPath, commonModules, index);
    //     }
    // }
    //
    // commonModules.forEach(function(item, i, arr) {
    //     arr[i] = common + '/' + item.replace(/-module/g, '');
    // });
    //
    // modules = generalModules.concat(commonModules);

    // return modules;

    return 's';
}

module.exports = existingBlocks;
