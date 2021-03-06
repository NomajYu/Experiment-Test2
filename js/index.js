let expName = '实验结果';
let timeline = []
let pId = '';
let pName = '';
let manResp = '';
let womanResp = '';
let jsPsych = initJsPsych({
    use_webaudio: true,
    on_finish: function () {
        jsPsych.data.get().localSave('csv', expName);
    }
});

//全屏
var enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: `<div style="margin-bottom:20px">您好！请点击下方按钮进入全屏模式进行实验</div>`,
    button_label: '进入全屏'
}

//预加载
let preload = {
    type: jsPsychPreload,
    images: [imgList],
    audio: voiceList,
    show_detailed_errors: true,
    message: `<div>正在加载资源，请稍后</div>`
}

//收集被试信息
let participantInfo = {
    type: jsPsychSurveyText,
    questions: [{
            prompt: '序号（由主试提供）',
            name: 'pId',
            required:true
        },
        {
            prompt: '姓名',
            name: 'pName',
            required:true
        },
        {
            prompt: '年龄',
            name: 'pAge',
            required:true
        },
        {
            prompt: '性别',
            name: 'pSex',
            required:true
        }
    ],
    button_label: "进入实验",
    on_finish: function (data) {
        pId = parseInt(data.response.pId)
        pName = data.response.pName
        expName = expName + '-' + 'No' + pId + '.csv';
        if (pId % 2 === 0) {
            manResp = 'J'
            womanResp = 'F'
        } else {
            manResp = 'F'
            womanResp = 'J'
        }
    }
}

//指导语
let instructions = {
    type: jsPsychInstructions,
    pages: function() {
        let richText1 = `
        <h1 style="color:#EE2C2C">欢迎参与我们的实验</h1>
        <div style="margin-top:30px;font-weight:bold;">实验中请勿退出全屏模式</div>
        <div style="margin-top:20px;margin-bottom:90px;"><按空格键继续></div>
        <div style="font-size:15px;color:grey">苏州大学心理学系</div>
        `;
        let richText2 = `
        <div >请仔细阅读以下实验说明</div>
        <div class="mt15">
            <div class="mt15">首先，你会看到一个人，然后其会消失</div>
            <div class="mt15">接着，在屏幕左侧或右侧会出现第二个人，并且停留在屏幕上，你需要对第二个人进行以下判断：</div>
            <div class="mt15">1）当第二个人为<text class="bold">男性</text>时请按<text class="rb"> ${manResp} </text>键，为<text class="bold">女性</text>时请按<text class="rb"> ${womanResp} </text>键（请牢记性别对应的按键）</div>
            <div class="mt15">2）对第二个人的喜爱程度进行1-9的打分，1代表非常不喜欢，9代表非常喜欢</div>
            <div class="mt15">实验中途遇到任何问题请与主试联系</div>
            <div class="mt15">准备好了请按空格键开始<text style="font-weight:bold">练习</text></div>
        </div>
       `
       return [richText1,richText2]
    },
    key_forward: ' ',
    allow_backward: false
}

//第一帧，注视点
let fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h3>+</h3>`,
    trial_duration: 600,
    response_ends_trial: false,
    choices: "NO_KEYS",
}

//第二帧，直接注视
let cueDirect = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        let directImg = cuePath + jsPsych.timelineVariable('dg') + '.png'
        return directImg
    },
    trial_duration: 1500,
    response_ends_trial: false,
    choices: "NO_KEYS",
}

//第三帧，转移注视图片
let image_object = {
    obj_type: 'image',
    file: function () {
        let img = cuePath + jsPsych.timelineVariable('cue') + '.png';
        return img;
    },
    show_start_time: 0
}

//第三帧，语音
let sound_object = {
    obj_type: 'sound',
    file: function () {
        let voice = voicePath + jsPsych.timelineVariable('voice') + '.wav';
        return voice;
    },
    show_start_time: 0,
}

//第三帧综合
let cueAvert = {
    type: jsPsychPsychophysics,
    stimuli: [image_object, sound_object],
    background_color: '#FFFFFF',
    trial_duration: 300,
    choices: "NO_KEYS",
};

//第四帧，目标刺激，按键反应
let target = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        let targetImg = targetPath + jsPsych.timelineVariable('target') + '.png';
        let degree = jsPsych.timelineVariable('direction') == 'd1' ? '-105%' : '105%';
        return `
                  <div style="transform: translateX(${degree})"><img src="${targetImg}"></div>
              `
    },
    // prompt: `<div style="margin-top:60px;font-size:15px;color:lightgrey">当面孔为女性时请按“F”键，男性则按“J”键</div>`,
    choices: ['f', 'j'],
    data: function () {
        return {
            condition: jsPsych.timelineVariable('cue') +
                jsPsych.timelineVariable('voice') +
                jsPsych.timelineVariable('direction') +
                jsPsych.timelineVariable('target')
        };
    }
}

//第五帧，评分
let rate = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div>
        <div style="margin-bottom:10px">请对刚刚出现的第二个人进行喜爱度评价</div>
        <div style="margin-bottom:20px">按下数字键1~9进行评价</div>
        <div style="display:flex;">
            <div style="width:70px;height:30px"></div>
            <div class="number">1</div>
            <div class="number">2</div>
            <div class="number">3</div>
            <div class="number">4</div>
            <div class="number">5</div>
            <div class="number">6</div>
            <div class="number">7</div>
            <div class="number">8</div>
            <div class="number">9</div>
            <div style="width:50px;height:30px"></div>
        </div>
        <div style="margin-top:30px;display:flex;justify-content:space-between">
            <div>非常不喜欢</div>
            <div>非常喜欢</div>
        </div>
        </div>`,
    choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
};

//循环练习试次
let crossroads = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        let richText = `
                        <div style="margin-bottom:10px">练习试次已结束，按 A 再进行一次练习</div>
                        <div style="margin-bottom:20px">若您已经准备好了，按 B 开始<text style="color:#CD2626">正式实验</text></div>
                        <div style="margin-bottom:10px">如果对实验流程仍有疑惑，请先与主试沟通后再开始正式实验</div>
                        <div><提示：当第二个人为<text class="bold">男性</text>时请按<text class="rb"> ${manResp} </text>键，为<text class="bold">女性</text>时请按<text class="rb"> ${womanResp} </text>键></div>
                       `
        return richText
    },
    choices: ['a', 'b']
}

//休息
let rest = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div>请耐心地休息2分钟</div>`,
    trial_duration: 120000,
    response_ends_trial: false,
    choices: "NO_KEYS",
}

//休息结束提示
let notice = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div>准备好了请按空格键继续实验</div>`,
    choices: " "
}

//离开全屏
var leave_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false
}



//上传实验数据
let uploadData = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div>正在上传实验数据，请稍后</div>`,
    choices: [' '],
    trial_duration: 10000,
    on_start: function() {
        let pData = jsPsych.data.get().csv()
        upload(pData,pId,pName,manResp)
    }
}

//实验结束提示
let end = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
            <div>实验已全部完成</div>
            <div class="mt15">
                <div>请与主试联系，待主试确认过后即可关闭本页面，并领取被试费</div>
                <div>非常感谢您的配合，祝您生活愉快 : )</div>
                <div></div>
            </div>
              `,
    response_ends_trial: true,
    choices: ["d"],
}

// 封装一个试次
let a_trial = {
    timeline: [fixation, cueDirect, cueAvert, target, rate],
    timeline_variables: arrayOfPractice,
    randomize_order: true,
}

//练习模块
let practice_trials = {
    timeline: [a_trial, crossroads],
    randomize_order: true,
    loop_function: function (data) {
        let resp = data.last(1).trials[0].response;
        if (resp === "a") {
            return true;
        } else {
            return false;
        }
    }
}

//block1
let block_1 = {
    timeline: [fixation, cueDirect, cueAvert, target, rate],
    timeline_variables: arrayOfMan,
    randomize_order: true,
}

//block2
let block_2 = {
    timeline: [fixation, cueDirect, cueAvert, target, rate],
    timeline_variables: arrayOfWoman,
    randomize_order: true,
}

//时间线数组
timeline.push(
    preload, enter_fullscreen, 
    participantInfo, 
    instructions, practice_trials,
    block_1, rest, notice, block_2,
    uploadData,
    leave_fullscreen, end
)

//加载时间线
jsPsych.run(timeline);