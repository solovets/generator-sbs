var fs = require('fs'),
    path = require('path'),
    existingBlocks = getExistingBlocks,

    count = 0,
    obj = {};

function checkPresenceOfSuffix(name, config) {
    return new RegExp('.+' + config.collectionSuffix + '$').test(name) && config.useCollections;
}

function checkLackOfPrefixes(name, config) {
    return !(new RegExp('^' + config.prefixForElement + '|^' + config.prefixForModifier).test(name));
}

function checkPrefix(name, prefix) {
    return new RegExp('^' + prefix).test(name);
}

function readTree() {
    return 'word';
}

function getDirectories(dirPath) {

    var dirContent = fs.readdirSync(dirPath),
        listOfDirectories = [];

    listOfDirectories = dirContent.filter(function(item, index, array) {
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

function getCollectionStructure(generatorConfig, dirPath, point) {
    point.blocks = [];

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

    if (point.collections.length > 0) {
        point.collections.forEach(function(item, index, array) {
            getCollectionStructure(generatorConfig, path.join(dirPath, array[index].name), item);
        });
    }
}

// function buildTree(generatorConfig, dirPath, point, callback) {
//     console.log(count);
//     count++;
//
//     var dirContent = getDirectories(dirPath),
//         i;
//
//     if (count === 1) {
//         point.blocks = [];
//         point.collections = [];
//     } else if (count === 2) {
//         point.blocks = [];
//     }
//
//     if (count === 1 || count === 2) {
//         for (i in dirContent) {
//             if (dirContent.hasOwnProperty(i)) {
//                 if (checkPresenceOfSuffix(dirContent[i], generatorConfig)) {
//
//                     point.collections.push({
//                         name: dirContent[i],
//                         blocks: []
//                     });
//
//                 } else if (checkLackOfPrefixes(dirContent[i], generatorConfig)) {
//
//                     point.blocks.push({
//                         name: dirContent[i],
//                         elements: [],
//                         modifiers: []
//                     });
//
//                 }
//             }
//         }
//     }
//
//     if (count === 1 && point.collections.length > 0) {
//         for (i in point.collections) {
//             if (point.collections.hasOwnProperty(i)) {
//                 buildTree(generatorConfig, path.join(dirPath, point.collections[i].name), point.collections[i], readTree);
//             }
//         }
//     }
//
//     if (count === 2) {
//         console.log( JSON.stringify(obj,null,4) );
//     }
//
//
//     count--;
//
//     if ((count === 0 || count === 4) && callback) {
//         callback();
//     }
// }

function getExistingBlocks(generatorConfig, bemDirPath) {

    obj[generatorConfig.bemDirectory] = {};

    //buildTree(generatorConfig, bemDirPath, obj[generatorConfig.bemDirectory], readTree);
    getRootStructure(generatorConfig, bemDirPath, obj[generatorConfig.bemDirectory]);

    return 's';
}

module.exports = existingBlocks;