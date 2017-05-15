var fs = require('fs'),
    path = require('path'),
    currentStructure = getCurrentStructure,

    obj = {},
    log = console.log,
    json = function (arg) {
        return JSON.stringify(arg, null, 4);
    };

function hasCollectionSuffix(config, name) {
    return new RegExp('.+' + config.collectionSuffix + '$').test(name);
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

function pushModifier(generatorConfig, point, item) {
    if (checkPresenceOfPrefix(item, generatorConfig.prefixForModifier)) {
        point.modifiers.push({
            name: item
        });
    }
}

function getElementStructure(generatorConfig, dirPath, point) {
    var dirContent = getDirectories(dirPath);

    dirContent.forEach(function(item) {
        pushModifier(generatorConfig, point, item);
    });
}

function getBlockStructure(generatorConfig, dirPath, point) {
    var dirContent = getDirectories(dirPath);

    dirContent.forEach(function(item) {

        if (checkPresenceOfPrefix(item, generatorConfig.prefixForElement)) {
            point.elements.push({
                name: item,
                modifiers: []
            });
        } else {
            pushModifier(generatorConfig, point, item);
        }

    });

    point.elements.forEach(function(item, index) {
        getElementStructure(generatorConfig, path.join(dirPath, item.name), point.elements[index]);
    });

}

function getBlockStructureNew(item, index) {
    log(index);
}

function getCollectionBlocks(generatorConfig, dirPath, point) {

    var dirContent = getDirectories(dirPath);

    dirContent.forEach(function(item) {
        pushBlock(generatorConfig, point, item);
    });

    // point.blocks.forEach(function(item, index, array) {
    //     getBlockStructure(generatorConfig, path.join(dirPath, item.name), point.blocks[index]);
    // });
}

function getRootStructure (generatorConfig, dirPath, point) {

    var rootDirContent = getDirectories(dirPath);

    point.blocks = [];
    point.collections = [];

    rootDirContent.forEach(function(item) {

        if (hasCollectionSuffix(generatorConfig, item)) {
            if (generatorConfig.useCollections) {
                point.collections.push({
                    name: item,
                    blocks: []
                });
            }
        } else {
            pushBlock(generatorConfig, point, item);
        }
    });

    point.blocks.forEach(getBlockStructureNew);

    // point.blocks.forEach(function(item, index, array) {
    //     getBlockStructure(generatorConfig, path.join(dirPath, item.name), point.blocks[index]);
    // });

    point.collections.forEach(function(item, index) {

        var collectionsDirContent = getDirectories(path.join(dirPath, item.name));

        collectionsDirContent.forEach(function(item) {
            pushBlock(generatorConfig, point.collections[index], item);
        });

        point.collections[index].blocks.forEach(getBlockStructureNew);
    });
}

function getCurrentStructure(generatorConfig, bemDirPath) {

    var bemDirectory = generatorConfig.bemDirectory;

    obj.bemDirectory = {};
    getRootStructure(generatorConfig, bemDirPath, obj.bemDirectory);

    log(json(obj));

    return obj;
}

module.exports = currentStructure;