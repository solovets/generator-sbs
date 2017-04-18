var fs = require('fs'),
    path = require('path'),
    existingBlocks = getExistingBlocks,

    obj = {},
    log = console.log;

function checkPresenceOfSuffix(name, config) {
    return new RegExp('.+' + config.collectionSuffix + '$').test(name) && config.useCollections;
}

function checkLackOfPrefixes(name, config) {
    return !(new RegExp('^' + config.prefixForElement + '|^' + config.prefixForModifier).test(name));
}

function checkPresenceOfPrefix(name, prefix) {
    return new RegExp('^' + prefix).test(name);
}

function getDirectories(dirPath) {

    var dirContent = fs.readdirSync(dirPath),
        listOfDirectories = [];

    listOfDirectories = dirContent.filter(function(item) {
            return fs.lstatSync(path.join(dirPath, item)).isDirectory();
        });

    return listOfDirectories;
}

function pushBlock(generatorConfig, point, item) {
    if (checkLackOfPrefixes(item, generatorConfig)) {
        point.blocks.push({
            name: item,
            elements: [],
            modifiers: []
        });
    }
}

function getBlockStructure(generatorConfig, dirPath, point) {
    var dirContent = getDirectories(dirPath);

    dirContent.forEach(function(item) {
        if (checkPresenceOfPrefix(item, generatorConfig.prefixForElement)) {
            point.elements.push({
                name: item,
                modifiers: []
            });
        } else if (checkPresenceOfPrefix(item, generatorConfig.prefixForModifier)) {
            point.modifiers.push({
                name: item
            });
        }
    });
}

function getCollectionBlocks(generatorConfig, dirPath, point) {

    var dirContent = getDirectories(dirPath);

    dirContent.forEach(function(item) {
        pushBlock(generatorConfig, point, item);
    });

}

function getRootStructure (generatorConfig, dirPath, point) {
    point.blocks = [];
    point.collections = [];

    var dirContent = getDirectories(dirPath);

    dirContent.forEach(function(item) {
        if (checkPresenceOfSuffix(item, generatorConfig)) {
            point.collections.push({
                name: item,
                blocks: []
            });
        } else {
            pushBlock(generatorConfig, point, item);
        }
    });

    point.collections.forEach(function(item) {
        getCollectionBlocks(generatorConfig, path.join(dirPath, item.name), item);
    });

    point.blocks.forEach(function(item, index, array) {
        getBlockStructure(generatorConfig, path.join(dirPath, item.name), item);
    });

    log(JSON.stringify(obj,null,4));
}

function getExistingBlocks(generatorConfig, bemDirPath) {

    log(JSON.stringify(generatorConfig));

    obj[generatorConfig.bemDirectory] = {};

    getRootStructure(generatorConfig, bemDirPath, obj[generatorConfig.bemDirectory]);

    return 's';
}

module.exports = existingBlocks;