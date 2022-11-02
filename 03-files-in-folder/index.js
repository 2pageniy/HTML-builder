const { readdir } = require('fs/promises');
const { stat } = require('fs');   
const path = require('path');

const pathDir = path.resolve(__dirname, 'secret-folder');

async function readFilesInDir() {
    const files = await readdir(pathDir, {withFileTypes: true});
    for (const file of files) 
    {
        if (file.isDirectory()) {
            continue;
        }
        let extname = path.extname(file.name);
        let fileName = file.name.slice(0, file.name.length - extname.length);

        const pathFile = path.join(pathDir, file.name)
        stat(pathFile, (err, stats) => {
            let sizeFile = stats.size;
            console.log(`${fileName} - ${extname.slice(1)} - ${sizeFile}b`);
        });
    }
}

readFilesInDir()