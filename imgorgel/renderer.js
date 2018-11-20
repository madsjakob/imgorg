const { remote } = require('electron');
const fs = remote.require('fs');
const path = require('path');
const fse = require("fs-extra");
const config = require('electron-json-config');
const dateFormat = require('dateformat');

let selectPath = function selectPath(target, dirPath, callback) {
    
    config.set(target, dirPath);
    let mappeNavn = document.getElementById(target);
    mappeNavn.value = dirPath;
    callback(dirPath);
}

let readDir = function readDir(dirPath) {
    let img = document.getElementById('currentImg');
    img.imgIndex = -1;
    fs.readdir(dirPath, (err, dir) => {
        console.log(dir);
        let imgArr = [];
        if (dir.length > 0) {
            for (let index = 0; index < dir.length; index++) {
                imgArr.push(path.join(dirPath, dir[index]));
            }
            img.imgIndex = 0;
        }
        img.imgArr = imgArr;
        displayImage();
    });
}

let displayImage = function displayImage() {
    let img = document.getElementById('currentImg');
    let imgRow = document.getElementById('imgRow');
    let btnRow = document.getElementById('btnRow');
    if (img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) {
        imgRow.style.visibility = "visible";
        btnRow.style.visibility = "visible";
        let filepath = img.imgArr[img.imgIndex];
        let ext = path.extname(filepath).toLocaleLowerCase();
        if (ext == '.png') {
            imgType = 'data:image/png;base64';
        }
        else if (ext == '.jpg') {
            imgType = 'data:image/jpg;base64';
        }
        else if (ext == '.gif') {
            imgType = 'data:image/gif;base64';
        }

        let imgData = fs.readFileSync(filepath).toString('base64');
        img.src = imgType + "," + imgData;
    } else {
        btnRow.style.visibility = "hidden"
        imgRow.style.visibility = "hidden"
    }
}

let nextImage = function nextImage() {
    let img = document.getElementById('currentImg');
    if (img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) {
        img.imgIndex = img.imgIndex + 1;
        if (img.imgIndex >= img.imgArr.length) {
            img.imgIndex = 0;
        }
        displayImage();
    }
}

let removeImage = function removeImage() {
    let img = document.getElementById('currentImg');
    if (img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) {
        img.imgArr.splice(img.imgIndex, 1);
        if (img.imgArr.length > 0) {
            if (img.imgIndex >= img.imgArr.length) {
                img.imgIndex = 0;
            }
        } else {
            img.imgIndex = -1;
        }
        displayImage();
    }
}

let getFilename = function getFilename() {
    let result = null;
    let img = document.getElementById('currentImg');
    if (img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) {
        result = img.imgArr[img.imgIndex];
    }
    return result;
}

let moveImage = function moveImage(source, target, callback) {
    let targetDir = path.dirname(target);
    console.log(targetDir);
    if (!fs.existsSync(targetDir)) {
        console.log("Creating directory " + targetDir);
        fse.ensureDirSync(targetDir);
    }
    fs.copyFile(source, target, callback);
}

let archiveImage = function archiveImage() {
    let filename = getFilename();
    if (filename) {
        let stats = fs.statSync(filename);
        let filetime = stats.mtime;
        let dateFolder = path.join(dateFormat(filetime, "yyyy"), dateFormat(filetime, "mm"), dateFormat(filetime, "dd"));
        let archive = document.getElementById("archive");
        let archivePath = archive.value;
        let targetPath = path.join(archivePath, dateFolder);
        let targetFilename = path.join(targetPath, path.basename(filename));
        console.log("Arkiverer " + filename + " som " + targetFilename);
        moveImage(filename, targetFilename, err => {
            if (err) {
                console.log(err);
            } else {
                removeImage();
                fs.unlinkSync(filename);
            }
        });
    }
}

let discardImage = function discardImage() {
    let filename = getFilename();
    if (filename) {
        let archive = document.getElementById("archive");
        let archivePath = archive.value;
        let discardPath = path.join(archivePath, "discard");
        let targetFilename = path.join(discardPath, path.basename(filename));
        moveImage(filename, targetFilename,  err => {
            if (err) {
                console.log(err);
            } else {
                removeImage();
                fs.unlinkSync(filename);
            }
        });
    }
}

let selectDirectory = function selectDirectory(target, callback) {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openDirectory']
        },
        (filepaths, bookmarks) => { selectPath(target, filepaths[0], callback); }
    );
}

let sourceBtn = document.getElementById('sourceBtn');
sourceBtn.addEventListener('click', _ => {
    selectDirectory("source", readDir);
});

let archiveBtn = document.getElementById('archiveBtn');
archiveBtn.addEventListener('click', _ => {
    selectDirectory("archive", _ => {});
});

let nextbutton = document.getElementById('btnnext');
nextbutton.addEventListener('click', _ => {
    nextImage();
});

let discardbutton = document.getElementById('btndiscard');
discardbutton.addEventListener('click', _ => {
    discardImage();
});
let archivebutton = document.getElementById('btnarchive');
archivebutton.addEventListener('click', _ => {
    archiveImage();
});

window.addEventListener('load', _ => {
    let sourcePath = config.get('source');
    if(sourcePath) {
        selectPath("source", sourcePath, readDir);
    }
    let archivePath = config.get('archive');
    if(archivePath) {
        selectPath("archive", archivePath, _ => {});
    }
});

console.log(process);
