const fs = require('fs'),
    path = require('path');

    let dir,
        count = 0;

function prepareTestDir(pathToTestDir) {

    if (count === 0) dir = pathToTestDir;

    if (fs.existsSync(pathToTestDir)) {
        count++;
        fs.readdirSync(pathToTestDir).forEach((file) => {
             let currentPath = pathToTestDir + path.sep + file;
             if (fs.lstatSync(currentPath).isDirectory()) {
                prepareTestDir(currentPath);
            } else {
                fs.unlinkSync(currentPath);
                
            }
        });
        fs.rmdirSync(pathToTestDir);
        count--;
    }

    if (count === 0) fs.mkdirSync(pathToTestDir);
    
}



module.exports = prepareTestDir;