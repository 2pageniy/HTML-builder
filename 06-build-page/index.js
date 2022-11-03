const fs = require('fs');
const { copyFile, readdir } = require('fs/promises');
const path = require('path');

const projectPath = path.resolve(__dirname, 'project-dist')


fs.mkdir(projectPath, { recursive: true }, (err) => {
    if (err) throw err;
});

const assetCopyPath = path.resolve(__dirname, 'project-dist', 'assets')
const assetPath = path.resolve(__dirname, 'assets')

async function bundledCss() {
    const stylesDir = path.resolve(__dirname, 'styles')
    const projectDir = path.resolve(projectPath, 'style.css')

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

async function copyFiles(originalPath, copyPath) {
    const files = await readdir(originalPath, {withFileTypes: true});
    fs.mkdir(copyPath, { recursive: true }, (err) => {
        if (err) throw err;
    });
    for (const file of files) {
        if (file.isDirectory()) {
            const newCopyPath = path.resolve(copyPath, file.name)
            fs.mkdir(newCopyPath, { recursive: true }, (err) => {
                if (err) throw err;
            });
            copyFiles(path.resolve(originalPath, file.name), newCopyPath)
            continue;
        }

        try {
            let fileCopy = path.resolve(copyPath, file.name)
            let originalFile = path.resolve(originalPath, file.name)
            copyFile(originalFile, fileCopy);
        } catch {
            console.log('The file could not be copied');
        }
    } 
}

copyFiles(assetPath, assetCopyPath)

async function template() {
    let pathTemplate = path.resolve(__dirname, 'template.html');
    const pathComponents = path.resolve(__dirname, 'components')
    let data = '';
    const readableStream = fs.createReadStream(pathTemplate, 'utf-8');
    const files = await readdir(pathComponents, {withFileTypes: true});
    let readComponent;
    readableStream.on('data', chunk => data += chunk);
    readableStream.on('end', () => {
        data = data.split(/{{|}}/g)
        for (const file of files) {
            const extname = path.extname(file.name);
            if (extname !== '.html' || file.isDirectory()) {
                continue;
            }

            const fileName = file.name.slice(0, file.name.length - extname.length)
            const pathFile = path.resolve(pathComponents, file.name)
            const index = data.indexOf(fileName);

            if (index !== -1) {
                data[index] = '';
                readComponent = fs.createReadStream(pathFile, 'utf-8');
                readComponent.on('data', chunk => data[index] += chunk);
            }
        }
        readComponent.on('end', () => {
            data = data.join('');
            const projectDir = path.resolve(projectPath, 'index.html')
            const output = fs.createWriteStream(projectDir);
            output.write(data)
        })
    });
}
template()