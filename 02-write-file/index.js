const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'file.txt');

const output = fs.createWriteStream(pathFile);

console.log('Введите текст для записи в файл:');

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        process.exit()
    }
    
    output.write(data)
});

process.on('SIGINT', () => process.exit());

process.on('exit', () => console.log('file.txt успешно создан!'));