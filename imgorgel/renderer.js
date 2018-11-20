const {remote} = require('electron');
const fs = remote.require('fs');
const path = require('path');



let displayImages = function displayImages(filepaths, bookmarks) {
    console.log(filepaths);
    let img = document.getElementById('currentImg');
    let dirPath = filepaths[0];
    let mappeNavn = document.getElementById('mappe');
    mappeNavn.value = dirPath;
    img.imgIndex = -1;
    fs.readdir(dirPath, (err, dir) => {
        console.log(dir);
        if(dir.length > 0) {
            let imgArr = [];
            for(let index = 0; index < dir.length; index++) {
                imgArr.push(path.join(dirPath, dir[index]));
            }
            img.imgArr = imgArr;
            img.imgIndex = 0;
            displayImage();
        }
    });
}

let displayImage  = function displayImage() {
    let img = document.getElementById('currentImg');
    let imgRow = document.getElementById('imgRow');
    let btnRow = document.getElementById('btnRow');
    if(img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) {
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
    if(img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) { 
        img.imgIndex = img.imgIndex + 1;
        if(img.imgIndex >= img.imgArr.length) {
            img.imgIndex = 0;
        }
        displayImage();
    }    
}

let removeImage = function removeImage() {
    let img = document.getElementById('currentImg');
    if(img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) { 
        img.imgArr.splice(img.imgIndex, 1);
        if (img.imgArr.length > 0)
        {
            if(img.imgIndex >= img.imgArr.length) {
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
    if(img.imgIndex >= 0 && img.imgArr && img.imgArr.length > 0) { 
        result =  img.imgArr[img.imgIndex];
    }
    return result;
}

let archiveImage = function archiveImage() {
    let filename = getFilename();
    if (filename) {
        console.log("Arkiverer " + filename);
        removeImage();
    }
}

let discardImage = function discardImage() {
    let filename = getFilename();
    if (filename) {
        console.log("Kasserer " + filename);
        removeImage();
    }

}

let selectDirectory = function selectDirectory(){
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openDirectory']
      },
      displayImages
      );
}

let filebutton = document.getElementById('filebutton');
filebutton.addEventListener('click', _ => {
    selectDirectory();
});

let nextbutton = document.getElementById('btnnext');
nextbutton.addEventListener('click', _ => {
    console.log('click');
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


console.log(process);
console.log(process.type);

