var fs = require('fs'),
    path = require('path'),
    currentStructure = getCurrentStructure,

    obj = {},
    config,
    ext,
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

    var fileExists = fs.existsSync(path.join(dirPath, item, item + ext));

    if (checkLackOfPrefixes(item) && fileExists) {
        point.blocks.push({
            name: item,
            elements: [],
            modifiers: []
        });
    }
}

function buildBlockTree(dirPath, parentComponent, allowedPrefixes, blockName) {

    var itemDirPath,
        itemDirContent,
        modifierFilePath,
        elementFilePath;

    if (allowedPrefixes.length > 0) {

        itemDirPath = path.join(dirPath, parentComponent.name);
        itemDirContent = getDirectories(itemDirPath);

        itemDirContent.forEach(function (componentName) {

            modifierFilePath = path.join(itemDirPath, componentName, (blockName ? blockName : '') + parentComponent.name + componentName + ext);
            elementFilePath = path.join(itemDirPath, componentName, parentComponent.name + componentName + ext);

            if (checkPresenceOfPrefix(componentName, config.prefixForElement) && allowedPrefixes.includes(config.prefixForElement) && fs.existsSync(elementFilePath)) {
                parentComponent.elements.push({
                    name: componentName,
                    modifiers: []
                });
            }

            if (checkPresenceOfPrefix(componentName, config.prefixForModifier) && allowedPrefixes.includes(config.prefixForModifier) && fs.existsSync(modifierFilePath)) {
                parentComponent.modifiers.push({
                    name: componentName
                });
            }
        });

        allowedPrefixes.pop();

        if (parentComponent.hasOwnProperty('elements')) {
            parentComponent.elements.forEach(function(element) {
                buildBlockTree(itemDirPath, element,  [config.prefixForModifier, config.prefixForElement], parentComponent.name);
            });
        }




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

    for (i = 0; i < point.blocks.length; i++) {
        buildBlockTree(dirPath, point.blocks[i], [config.prefixForModifier, config.prefixForElement]);
    }



    point.collections.forEach(function(currentCollection) {

        var collectionDirPath = path.join(dirPath, currentCollection.name),
            collectionDirContent = getDirectories(collectionDirPath);

        collectionDirContent.forEach(function(collectionItem) {
            pushBlock(collectionDirPath, currentCollection, collectionItem);
        });

        for (i = 0; i < currentCollection.blocks.length; i++) {
            buildBlockTree(collectionDirPath, currentCollection.blocks[i], [config.prefixForModifier, config.prefixForElement]);
        }
    });
}

function getCurrentStructure(generatorConfig, bemDirPath) {

    config = generatorConfig;
    ext = '.' + config.ext;

    getRootStructure(bemDirPath, obj);

    return obj;
}

module.exports = currentStructure;