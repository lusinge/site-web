'use strict';

const path = require('path');
const fs = require('fs');

const listDir = (dir, fileList = [], active = false ) => {

    let files = fs.readdirSync(dir);

    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            if(! ("page" === file) ) {
              fileList = listDir(path.join(dir, file), fileList, true);
            }
        } else {
            if( (/^index\.html$/.test(file)) && (active) ) {
                const name = 'status.html';
                let src = path.join(dir, file);
                let newSrc = path.join(dir, name);
                fileList.push({
                    oldSrc: src,
                    newSrc: newSrc
                });
            }
        }
    });

    return fileList;
};

let foundFiles = listDir( './public/news');
listDir('./public/resource', foundFiles);
listDir('./public/projects', foundFiles);

foundFiles.forEach(f => {
   fs.renameSync(f.oldSrc, f.newSrc);
});
