const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const stylesDir = path.resolve(__dirname, 'styles')
const projectDir = path.join(__dirname, 'project-dist', 'bundle.css')

async function bundledCss() {
    const files = await readdir(stylesDir, {withFileTypes: true});
    let data = '';
    let readableStream;

    for (const file of files) {
        const extname = path.extname(file.name);
        if (extname !== '.css' || file.isDirectory()) {
            continue;
        }
        const pathFile = path.join(stylesDir, file.name)
        readableStream = fs.createReadStream(pathFile, 'utf-8');
        readableStream.on('data', chunk => data += chunk);
    }
    const output = fs.createWriteStream(projectDir);

    readableStream.on('end', () => output.write(data));
}

bundledCss()