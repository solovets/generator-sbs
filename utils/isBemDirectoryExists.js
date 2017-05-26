var fs = require('fs'),
    isBemDirectoryExists = checkBemDirectory;

function checkBemDirectory(path, callFromConfigGenerator) {

    if (fs.existsSync(path)) {

        if (fs.lstatSync(path).isDirectory() === true) {
            if (callFromConfigGenerator) {
                return true;
            } else {
                console.log('Your BEM directory is ', path);
            }
        } else {
            if (callFromConfigGenerator) {
                return 'It looks like provided path ' + path + ' is not a directory.';
            } else {
                console.log('It looks like provided path\n' + path + '\n' +
                    'is not a directory.');
                process.exit(1);
            }
        }
    } else {
        if (callFromConfigGenerator) {
            return 'Can\'t find directory ' + path;
        } else {
            console.log('Can\'t find directory\n' + path);
            process.exit(1);
        }
    }
}

module.exports = isBemDirectoryExists;