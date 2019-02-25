const fs = require('fs');
const path = require('path');

const startDir = '../testIMG';//где берем файлы
const endDir = '../ResultIMG';//куда складываем

const copyFile = (pathFile,nameFile) =>{
    const localDir = path.join(endDir,nameFile[0]);
    if(!fs.existsSync(localDir)){
        fs.mkdirSync(localDir);
    }
    if(!fs.existsSync(path.join(localDir,nameFile))){
        fs.link(pathFile,path.join(localDir,nameFile), err => {
            if (err) {
                console.error(err.message);
                return;
            }
            fs.unlink(pathFile,err=>{
                if(err){
                    console.log(err);
                    return;
                }
            });
        });
    }
}


const checkDir = pathDir =>{
    try{
        const files = fs.readdirSync(pathDir);
        files.forEach(file=>{
            const localPath = path.join(pathDir,file);
            const state = fs.statSync(localPath);
            if(state.isDirectory()){
                checkDir(localPath);
            }else{
                copyFile(localPath,file);
            }
        });
    }catch(err){
        throw(new Error('error start directory'));
    }
}

const delDir = pathDir =>{
    const buffFiles = fs.readdirSync(pathDir);
    if(buffFiles.length>0){
        buffFiles.forEach(file=>{
            const fullPathFile = path.join(pathDir,file);
            delDir(fullPathFile);
        });
    }else{
        fs.rmdir(pathDir,err=>{
            if(err){
                console.log(err);
                return;
            }
        });
    }
}
checkDir(startDir);

setImmediate(() => {
    delDir(startDir);
});