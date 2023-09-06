const fs = require('fs');
const asar = require('asar');
const path = require('path');
// const readline = require('readline');

const rootPath = 'C:/Users/BioLi/AppData/Local/Programs/anytype/resources';
const asarPath = path.join(rootPath, 'app.asar');
const backupPath = path.join(rootPath, 'app_backup.asar');

const scriptPath = 'D:/Project/Anytype/anytype-script-system-self/dist/anytype-script-system-self.umd.cjs';
const stylePath = 'D:/Project/Anytype/anytype-script-system-self/dist/style.css';

// 检查是否存在备份文件
async function replaceAsar() {
  try {
    // 检查是否存在备份文件
    const backupExists = await fs.promises.access(backupPath).then(() => true).catch(() => false);

    if (backupExists) {
      // 删除当前的 app.asar 文件
      await fs.promises.unlink(asarPath);

      // 重命名备份文件为 app.asar
      await fs.promises.rename(backupPath, asarPath);

      console.log('ASAR file replaced successfully!');
    } else {
      console.log('Backup file not found!');
    }
  } catch (err) {
    console.error(err);
  }
}

// 备份原始的 ASAR 文件
async function backupAsarFile() {
  await fs.promises.copyFile(asarPath, backupPath);
}

// 解压和修改文件
async function modifyFiles() {
  const extractedPath = './extracted';

  // 解压ASAR文件
  await asar.extractAll(asarPath, extractedPath);

  // 修改 run.js
  const runJsPath = path.join(extractedPath, 'dist', 'run.js');
  let runJsContent = await fs.promises.readFile(runJsPath, 'utf-8');
  runJsContent += `
    const ScriptSelf = document.createElement('script');
    ScriptSelf.src = '${scriptPath}';
    ScriptSelf.type = 'text/javascript';
    document.body.appendChild(ScriptSelf);

    const StyleSelf = document.createElement('link');
    StyleSelf.href = '${stylePath}';
    StyleSelf.rel = 'stylesheet';
    document.head.appendChild(StyleSelf);
  `;
  await fs.promises.writeFile(runJsPath, runJsContent);

//   // 修改 main.js
//   const mainJsPath = path.join(extractedPath, 'dist', 'main.js');
//   const codeToAdd = `
// // Script System Self
// window.globals = 123
// `;
//   const tempFilePath = mainJsPath + '.tmp';
//   const readStream = fs.createReadStream(mainJsPath, { encoding: 'utf8' });
//   const writeStream = fs.createWriteStream(tempFilePath, { encoding: 'utf8' });
//   const rl = readline.createInterface({
//     input: readStream,
//     crlfDelay: Infinity
//   });

//   let lines = [];
//   rl.on('line', (line) => {
//     lines.push(line);
//   }).on('close', () => {
//     //240813
//     const insertIndex = 240813;
//     // const insertIndex = Math.max(lines.length - 4, 0);
//     lines.splice(insertIndex, 0, codeToAdd);
//     writeStream.write(lines.join('\n'));
//     writeStream.end(() => {
//       fs.renameSync(tempFilePath, mainJsPath);
//       fs.promises.writeFile(tempFilePath, '', { flag: 'wx' });
//     });
//   });
}

// 重新打包为 ASAR 文件
async function createNewAsar() {
  const extractedPath = './extracted';
  await asar.createPackage(extractedPath, asarPath);
}

(async () => {
  try {
    await replaceAsar();

    // 备份原始 ASAR 文件
    console.log("Wait backupAsarFile...")
    await backupAsarFile();
    console.log("Finish!")

    // 解压和修改文件
    console.log("Wait modifyFiles...")
    await modifyFiles();
    console.log("Finish!")

    // 重新打包为 ASAR 文件
    console.log("Wait createNewAsar...")
    await createNewAsar();
    console.log("Finish!")

    console.log('Code added successfully!');
  } catch (err) {
    console.error(err);
  }
})();