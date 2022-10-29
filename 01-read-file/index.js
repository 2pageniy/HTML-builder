const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(pathFile, 'utf-8');
readableStream.on('data', chunk => console.log(chunk));