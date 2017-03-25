var fs = require('fs'),
    isBemDirectoryExists = checkBemDirectory;

function checkBemDirectory(path) {

    if (fs.existsSync(path)) {

        if (fs.lstatSync(path).isDirectory() === true) {
            console.log('Your BEM directory is ', path);
        } else {
            console.log('It looks like\n' + path + '\n' +
                'is not a directory.\n' +
                'Please check your settings in .yo-rc.json');
            process.exit(1);
        }
    } else {
        console.log('Can\'t find directory\n' + path + '\n' +
            'Please check your settings in .yo-rc.json');
        process.exit(1);
    }
}

module.exports = isBemDirectoryExists;