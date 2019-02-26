const fs = require('fs');
const path = require('path');

const startDir = '../testIMG';//где берем файлы
const endDir = '../ResultIMG';//куда складываем

if(!fs.existsSync(endDir)){
    fs.mkdirSync(endDir);
}

const copyFile = (pathFile,nameFile) =>{
    const localDir = path.join(endDir,nameFile[0]);
    if(!fs.existsSync(localDir)){
        fs.mkdirSync(localDir);
    }
    if(!fs.existsSync(path.join(localDir,nameFile))){
        fs.linkSync(pathFile,path.join(localDir,nameFile));
        fs.unlinkSync(pathFile);
    }
}

const checkDir = (pathDir) =>{
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
        fs.rmdir(pathDir,err=>{
            if(err){
                console.log(err);
                return;
            }
        });
    }catch(err){
        throw(new Error('error start directory'));
    }
}

checkDir(startDir);