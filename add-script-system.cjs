const fs = require('fs');
const asar = require('asar');
const path = require('path');

const rootPath = 'C:/Users/BioLi/AppData/Local/Programs/anytype/resources';
const asarPath = path.join(rootPath, 'app.asar');
const backupPath = path.join(rootPath, 'app_backup.asar');

const scriptPath = 'D:/Project/Anytype/anytype-script-system-self/dist/anytype-script-system-self.umd.cjs';
const stylePath = 'D:/Project/Anytype/anytype-script-system-self/dist/style.css';

const addCode = `
const ScriptSelf = document.createElement('script');
ScriptSelf.src = '${scriptPath}';
ScriptSelf.type = 'text/javascript';
document.body.appendChild(ScriptSelf);

const StyleSelf = document.createElement('link');
StyleSelf.href = '${stylePath}';
StyleSelf.rel = 'stylesheet';
document.head.appendChild(StyleSelf);
`;

async function backupAsarFile() {
  return new Promise((resolve, reject) => {
    fs.copyFile(asarPath, backupPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function modifyRunJS() {
  const extractedPath = './extracted';
  await asar.extractAll(asarPath, extractedPath);

  const runJsPath = path.join(extractedPath, 'dist', 'run.js');
  await fs.promises.appendFile(runJsPath, addCode);
}

async function createNewAsar() {
  const extractedPath = './extracted';
  await asar.createPackage(extractedPath, asarPath);
}

(async () => {
  try {
    // 备份原始的 ASAR 文件
    console.log('ASAR file backed up is running...');
    await backupAsarFile();
    console.log('ASAR file backed up successfully!');

    // 操作提取后的文件，修改 run.js
    console.log('run.js modified is running...');
    await modifyRunJS();
    console.log('run.js modified successfully!');

    // 重新打包为 ASAR 文件
    console.log('New ASAR file created is running...');
    await createNewAsar();
    console.log('New ASAR file created successfully!');
    console.log('Code added successfully!');
  } catch (err) {
    console.error(err);
  }
})();