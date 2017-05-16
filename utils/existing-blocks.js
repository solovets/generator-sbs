var fs = require('fs'),
    path = require('path'),
    currentStructure = getCurrentStructure,

    obj = {},
    config,
    allowedPrefixes = [],
    i,
    log = console.log,
    json = function (arg) {
        return JSON.stringify(arg, null, 4);
    };

function hasCollectionSuffix(name) {
    return new RegExp('.+' + config.collectionSuffix + '$').test(name);
}

function checkLackOfPrefixes(name) {
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

function pushBlock(dirPath, point, item) {

    var fileExists = fs.existsSync(path.join(dirPath, item, item + '.' + config.ext));

    if (checkLackOfPrefixes(item) && fileExists) {
        point.blocks.push({
            name: item,
            elements: [],
            modifiers: []
        });
    }
}

function pushModifier(point, item) {
    if (checkPresenceOfPrefix(item, config.prefixForModifier)) {
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

function getBlockStructureNew(dirPath, itemObject) {

    if (allowedPrefixes.length > 0) {
        allowedPrefixes.pop();
        getBlockStructureNew(dirPath, itemObject);
    } else {
        log('ok');
    }

}

function getRootStructure (dirPath, point) {

    var rootDirContent = getDirectories(dirPath);

    point.blocks = [];
    point.collections = [];

    rootDirContent.forEach(function(item) {

        if (hasCollectionSuffix(item)) {
            if (config.useCollections) {
                point.collections.push({
                    name: item,
                    blocks: []
                });
            }
        } else {
            pushBlock(dirPath, point, item);
        }
    });

    //point.blocks.forEach(getBlockStructureNew.bind(null, dirPath));

    point.collections.forEach(function(currentCollection) {

        var collectionDirPath = path.join(dirPath, currentCollection.name),
            collectionDirContent = getDirectories(collectionDirPath);

        collectionDirContent.forEach(function(collectionItem) {
            pushBlock(collectionDirPath, currentCollection, collectionItem);
        });

        for (i = 0; i < currentCollection.blocks.length; i++) {
            getBlockStructureNew(collectionDirPath, currentCollection.blocks[i]);
        }
    });
}

function getCurrentStructure(generatorConfig, bemDirPath) {

    config = generatorConfig;

    allowedPrefixes = [
        config.prefixForModifier,
        config.prefixForElement
    ];

    getRootStructure(bemDirPath, obj);

    log(json(obj));

    return obj;
}

module.exports = currentStructure;