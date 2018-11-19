const {remote} = require('electron');
const fs = remote.require('fs');
const path = require('path');



let displayImages = function displayImages(filepaths, bookmarks) {
    console.log(filepaths);
    let dirPath = filepaths[0];
    let mappeNavn = document.getElementById('mappe');
    mappeNavn.value = dirPath;
    let target = document.getElementById('image_container');
    target.innerHTML = "";
    fs.readdir(dirPath, (err, dir) => {
        console.log(dir);
        for(let i = 0; i < dir.length; i++) {
            console.log("Hest");
            let imgType = null;
            let ext = path.extname(dir[i]);                
            if (ext.toLocaleLowerCase() == '.png') {
                imgType = 'data:image/png;base64';
            }
            else if (ext.toLocaleLowerCase() == '.jpg') {
                imgType = 'data:image/jpg;base64';
            }
            if(imgType != null) {
                console.log(path.join(dirPath, dir[i]));
                let imgData = fs.readFileSync(path.join(dirPath, dir[i])).toString('base64');
                // var imgTag = '<div class="div-thumbnail well"><img class="img-thumbnail rounded float-left img-responsive" src="' + imgType + ',' + imgData + '" alt="Hej"/></div>';

                let imgTag = '<div class="card"><img class="card-img-top" src="' + imgType + ',' + imgData + '" alt="Card image cap">'
                + ' <div class="card-body"><p class="card-text">' + dir[0] + '</p>'
                + '</div></div>';
                target.insertAdjacentHTML('beforeend', imgTag);
            }
            if(i > 19)
        {
            break;
        }
        }
        
    });
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

console.log(process);
console.log(process.type);
let mem = process.getSystemMemoryInfo();
let output = `
            <h2 class="page-header">App Version Data</h2>
            <ul class="list-group">
                <li class="list-group-item">Platform: ${process.platform}</li>
                <li class="list-group-item">Process ID: ${process.pid}</li>
                <li class="list-group-item">Node: ${process.versions.node}</li>
                <li class="list-group-item">Chrome: ${process.versions.chrome}</li>
                <li class="list-group-item">Electron: ${process.versions.electron}</li>
            </ul>
            <h2 class="page-header">System specs</h2>
            <ul class="list-group">
                <li class="list-group-item">System Architechture: ${process.arch}</li>
                <li class="list-group-item">Processor Identifier: ${process.env.PROCESSOR_IDENTIFIER}</li>
                <li class="list-group-item">Printer: ${process.env.PRINTER}</li>
            </ul>
            <h2 class="page-header">System Memory</h2>
            <ul class="list-group">
                <li class="list-group-item">Total: ${mem.total}</li>
                <li class="list-group-item">Free: ${mem.free}</li>
                <li class="list-group-item">Swap Total: ${mem.swapTotal}</li>
                <li class="list-group-item">Swap Free: ${mem.swapFree}</li>
            </ul>
    `;
    // document.getElementById('output').innerHTML = output;
// remote.dialog.showOpenDialog(remote.getCurrentWindow(),
// {
//     filters: [
//         { name: 'Images', extensions: ['png'] }
//     ]
// },
// function (filepaths, bookmarks) {
//     //read image (note: use async in production)
//     var _img = fs.readFileSync(filepaths[0]).toString('base64');
//     //example for .png
//     var _out = '<img src="data:image/png;base64,' + _img + '" />';
//     //render/display
//     var _target = document.getElementById('image_container');
//     _target.insertAdjacentHTML('beforeend', _out);

//     return;
// });

