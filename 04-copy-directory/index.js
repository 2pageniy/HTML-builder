const fs = require('fs');
const { copyFile, readdir } = require('fs/promises');
const path = require('path');

const copyDirPath = path.resolve(__dirname, 'files-copy');
const pathDir = path.resolve(__dirname, 'files');

fs.mkdir(copyDirPath, { recursive: true }, (err) => {
    if (err) throw err;
});
async function copyFiles() {
    const files = await readdir(pathDir);
    for (const file of files) {
        try {
            let fileCopy = path.resolve(copyDirPath, file)
            let originalFile = path.resolve(pathDir, file)
            await copyFile(originalFile, fileCopy);
            console.log(`${file} was copied`);
        } catch {
            console.log('The file could not be copied');
        }
    }
    
}

copyFiles()