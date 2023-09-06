const fs = require('fs');
const asar = require('asar');
const path = require('path');
const readline = require('readline');
const extractedPath = 'D:/Project/Anytype/anytype-script-system-self/extracted'
const mainJsPath = path.join(extractedPath, 'dist', 'main.js');
const codeToAdd = `
// Script System Self
window.globals = {
  AppGetVersion: AppGetVersion()
}
`;
const tempFilePath = mainJsPath + '.tmp';

const readStream = fs.createReadStream(mainJsPath, { encoding: 'utf8' });
const writeStream = fs.createWriteStream(tempFilePath, { encoding: 'utf8' });

const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    const insertIndex = Math.max(lines.length - 4, 0);
    lines.splice(insertIndex, 0, codeToAdd);
    writeStream.write(lines.join('\n'));
    writeStream.end(() => {
        fs.renameSync(tempFilePath, mainJsPath);
    });
});
// console.log(mainJsPath)