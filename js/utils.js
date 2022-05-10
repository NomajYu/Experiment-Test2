import $ from 'jquery'

let arrayOfMan = [];
let arrayOfWoman = [];
let jyList = [];
let fyList = [];
let imgList = [];
let voiceList = [];
let cuePath = 'asset/img/cue/';
let targetPath = 'asset/img/target/';
let voicePath = 'asset/audio/';
let arrayOfPractice = [];

//洗牌算法
Array.prototype.shuffle = function () {
    let input = this;
    for (let i = input.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

//判空
function isEmpty(obj) {
    return (typeof obj === "undefined" || obj === null || obj === "")
}

//生成练习数组
for (let i = 1; i < 9; i++) {
    let x = Math.random();
    let y = Math.random();
    let z = Math.random();
    x = x < 0.5 ? (Math.floor(x) + 1) : (Math.ceil(x) + 1)
    y = y < 0.5 ? (Math.floor(y) + 1) : (Math.ceil(y) + 1)
    z = z < 0.5 ? (Math.floor(z) + 1) : (Math.ceil(z) + 1)
    arrayOfPractice.push({
        dg: 'pcd',
        cue: 'pc' + x,
        direction: 'd' + y,
        voice: 'vp' + z,
        target: 'pt' + i
    })
}

arrayOfPractice.shuffle();

//生成block1(man)和block2(woman)数组
for (let i = 0; i < 16; i++) {
    for (let j = 1; j < 3; j++) {
        for (let k = 1; k < 3; k++) {
            arrayOfMan.push({
                cue: 'cm1',
                direction: 'd' + k,
                voice: 'vm' + j
            })
            arrayOfMan.push({
                cue: 'cm2',
                direction: 'd' + k,
                voice: 'vm' + j
            })
            arrayOfWoman.push({
                cue: 'cw1',
                direction: 'd' + k,
                voice: 'vw' + j
            })
            arrayOfWoman.push({
                cue: 'cw2',
                direction: 'd' + k,
                voice: 'vw' + j
            })
        }
    }
}

//生成图片以及语音数组，用于预加载
imgList.push(cuePath + "pcd" + '.png', cuePath + "md" + '.png', cuePath + "wd" + '.png')

for (let i = 1; i < 3; i++) {
    imgList.push(cuePath + "pc" + i + '.png');
    imgList.push(cuePath + "cm" + i + '.png');
    imgList.push(cuePath + "cw" + i + '.png');
    voiceList.push(voicePath + "vp" + i + ".wav");
    voiceList.push(voicePath + "vm" + i + ".wav");
    voiceList.push(voicePath + "vw" + i + ".wav");
}

for (let i = 1; i < 9; i++) {
    imgList.push(targetPath + "pt" + i + '.png');
}

for (let i = 1; i < 65; i++) {
    imgList.push(targetPath + "jY" + i + '.png', targetPath + "fY" + i + '.png');
    jyList.push("jY" + i);
    fyList.push("fY" + i);
}

jyList.shuffle();
fyList.shuffle();

//将block1和block2数组分别挂载上相同的目标刺激
for (let i = 0; i < 128; i++) {
    arrayOfMan[i].dg = "md";
    arrayOfWoman[i].dg = "wd";
    if (i <= 63) {
        arrayOfMan[i].target = jyList[i];
        arrayOfWoman[i].target = jyList[i];
    } else {
        let f = i - 64;
        arrayOfMan[i].target = fyList[f];
        arrayOfWoman[i].target = fyList[f];
    }

}

console.log('test');

arrayOfMan.shuffle();
arrayOfWoman.shuffle();

//提交数据
function upload(pData, pId, pName, manResp) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: "https://luexperiment.vercel.app/api/addResults",//http://localhost:3000/api/myFirstApi
        //提交的数据   该参数为属性值类型的参数
        data: {
            pId,
            pName,
            manResp,
            pData
        },
        //返回数据的格式
        datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
        //成功返回之后调用的函数             
        success: function (res) {
            if (isEmpty(res.insertedId)) {
                alert('数据上传失败！请联系主试处理')
            }
            console.log(res);
        },
        //调用出错执行的函数
        error: function (err) {
            alert('数据上传失败！请联系主试处理')
        }
    });
}

export let utils = {
    arrayOfMan,
    arrayOfWoman,
    imgList,
    voiceList,
    arrayOfPractice,
    cuePath,
    targetPath,
    voicePath,
    upload
};