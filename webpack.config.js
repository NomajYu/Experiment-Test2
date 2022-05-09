const path = require('path');
 
// 配置webpack的配置文件，需要配置的对象导出，给webpack使用
module.exports = {
 
    // 1、入口: entry,从哪个文件开始打包
    entry:'./js/index.js',
 
    // 2、出口：output，打包到哪里去
    output:{
 
        // 打包输出的目录（输出的目录必须是一个绝对路径）
        path:path.resolve(__dirname,'dist'),
        // 打包后生成的文件名
        filename:'main.js'
    },
 
     // 模式 mode development未压缩的，production压缩的
     mode:'production',
}