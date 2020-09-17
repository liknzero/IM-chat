/*
 * 递归遍历文件并处理相关数据
 * */
const fs = require('fs');
const path = require('path');

const css = path.resolve('./resources/waps/css');
const js = path.resolve('./resources/waps/js');

//调用文件遍历方法
fileDisplay(css);
fileDisplay(js);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 * @param outPath  输出文件路径
 */
function fileDisplay(filePath, outPath){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror,stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            // 处理相关业务
                            console.log(isFile)
                        }
                        if(isDir){
                            // 递归遍历
                            fileDisplay(filedir);
                        }
                    }
                })
            });
        }
    });
}