#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const rimraf = require('rimraf');

// AWS requires us to save the canary test scripts in the following folder structure:
// - nodejs
// -- node_modules
// ---- testFile.js
// ---- anotherTestFile.js
const createArtifactFolderStructure = () => {
  const createDir = path => {
    if (fs.existsSync(path)) return
    return fs.mkdirSync(path);
  }

  createDir('artifact');
  createDir('artifact/nodejs');
  createDir('artifact/nodejs/node_modules');
};

// Copy synthetic test files to artifacts folder
const copyFiles = () => {
  fs.readdir(path.resolve(process.cwd(), './tests'), (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
  
    files.forEach(file => {   
      const isJS = file.slice(-2) === 'js';
  
      if(isJS) {
        fs.copyFile(
          path.resolve(process.cwd(), `./tests/${file}`),
          path.resolve(process.cwd(), `artifact/nodejs/node_modules/${file}`),
          (err) => {
          if (err) throw err;
        });
      }
    });
  });
};

const zipArtifact = () => {
  const zipDirectory = (source, out) => {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(out);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(stream)
      ;
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
  };

  zipDirectory('artifact', 'artifact.zip').then(() => {
    // cleanup the artifacts folder
    rimraf("artifact", () => {
      console.log('Finished compiling build artifact');
    })
  })
};

(function run() {
  createArtifactFolderStructure();
  copyFiles();
  zipArtifact();
})();





