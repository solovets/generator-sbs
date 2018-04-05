const fs = require('fs');
const path = require('path');
const isBemDirectoryExists = checkBemDirectory;

function checkBemDirectory(dir) {

    dir = path.normalize(dir);

    if (path.isAbsolute(dir) !== true) {
        return 'Provided dir should be absolute';
    }

    switch ( fs.existsSync(dir) ) {
        case true:
            if (fs.lstatSync(dir).isDirectory()) {
                return true;
            } else {
                return dir + ' is not a directory.';
            }
            break;
        case false:
            return 'Can\'t find directory ' + dir;
            break;
    }
}

module.exports = isBemDirectoryExists;