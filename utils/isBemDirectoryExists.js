var fs = require('fs'),
    isBemDirectoryExists = checkBemDirectory;

function checkBemDirectory(path) {

    if (fs.existsSync(path)) {

        if (fs.lstatSync(path).isDirectory() === true) {
            return true;
        } else {
            return 'It looks like provided path ' + path + ' is not a directory.';
        }
    } else {
        return 'Can\'t find directory ' + path;
    }
}

module.exports = isBemDirectoryExists;