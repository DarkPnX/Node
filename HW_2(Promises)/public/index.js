const fs = require('fs');
const path = require('path');

const startDir = '../testIMG';//где берем файлы
const endPath = '../ResultIMG';//куда складываем
const arrTest = [];

if(!fs.existsSync(endPath)){
    fs.mkdirSync(endPath);
}

function copy(defDirFile,dirForSave,fileName){//чисто копирование
    return new Promise((resolve,reject)=>{
        //console.log(fileName);
        if(!fs.exists(path.join(dirForSave,fileName))){
            fs.link(defDirFile,path.join(dirForSave,fileName),err=>{
                if(err) return reject(err);
                fs.unlink(defDirFile,err=>{
                    if(err) return reject(err);
                    return resolve();
                });
            });
        }else{
            return resolve();
        }
    });
}

function copyFiles(pathFile,endDir=endPath){
    
    return new Promise(resolve=>{
        const files = fs.readdirSync(pathFile);
        Promise.all(files.map((file)=>{
            const state = fs.statSync(path.join(pathFile,file));
            //console.log(path.join(pathFile,file));
            if(state.isDirectory()){ 
                copyFiles(path.join(pathFile,file));
            }else{
                const localDir = path.join(endDir,file[0]);
                if(!fs.existsSync(localDir)){
                    fs.mkdirSync(localDir);
                    copy(path.join(pathFile,file),localDir,file);
                }else{
                    copy(path.join(pathFile,file),localDir,file);
                }
            }
        })
        );
        resolve();
        
    });
}

function deleteAll(dirPath){
    const files = fs.readdirSync(dirPath);
    console.log(files.length);
    if(files!=0){
        files.forEach(file=>{
            deleteAll(path.join(dirPath,file));
        });
    }
    fs.rmdirSync(dirPath);
}

copyFiles(startDir).then(()=>{
    //deleteAll(startDir);
    console.log('end');
});

