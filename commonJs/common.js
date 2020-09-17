// 组件按需引入
// 非必须组件不要引入，尽量控制公共js体积
import vConsole from './vConsole'
import '../../assets/commonJs/reloadPage' // 全局记录当前路由堆栈 // 记录参数为oldUrl
import '../../assets/commonJs/wechatShare' // 全局设置微信分享事件
require('promise.prototype.finally').shim(); // 引入promise兼容

import {
    Button,
    PullRefresh,
    NavBar,
    Tabbar,
    TabbarItem,
    Overlay,
    List,
    Uploader,
    Form,
    Field,
    Cell,
    ActionSheet,
    SwipeCell,
    Divider,
    NoticeBar,
    Icon,
    Tab,
    Tabs,
    Toast,
    Dialog,
    Swipe,
    SwipeItem,
    Search,
    Tag,
    Collapse,
    CollapseItem,
    RadioGroup,
    Radio,
    Popup
} from 'vant'

import "amfe-flexible/index.js";
window.Vue = require('vue') // 这里的vue仅作挂载插件用
window.Vue
    .use(Button)
    .use(PullRefresh)
    .use(NavBar)
    .use(Tabbar)
    .use(Divider)
    .use(Overlay)
    .use(List)
    .use(SwipeCell)
    .use(Tag)
    .use(Cell)
    .use(Tab)
    .use(ActionSheet)
    .use(NoticeBar)
    .use(Tabs)
    .use(Icon)
    .use(Field)
    .use(Form)
    .use(Uploader)
    .use(Toast)
    .use(Dialog)
    .use(TabbarItem)
    .use(Search)
    .use(Icon)
    .use(Swipe)
    .use(SwipeItem)
    .use(Radio)
    .use(RadioGroup)
    .use(SwipeItem)
    .use(Collapse)
    .use(CollapseItem)
    .use(Popup)
// [ Button, PullRefresh ].forEach(Compo => window.Vue.use(Compo));

window.Ajax = function ({
    url = '/',
    type = 'get',
    data = {},
    dataType = 'json',
    contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
    mimeType = 'none',
    processData = true,
    isLoading = false
}) {
    if (isLoading) {
        Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
        })
        // 做相关loading操作
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            type,
            data,
            dataType,
            contentType,
            mimeType,
            processData,
            success: (res) => {
                if (res.code === 0) {
                    resolve(res)
                } else if (res.code === 401) {
                    reject(res)
                    window.location.href = '/wap/auth/login'
                } else {
                    reject(res)
                }
            },
            error: (err) => {
                reject(err)
            },
            complete: () => {
                isLoading = false
            }
        })
    })
}

// 获取小程序码
window.onGetWechatCode = function ({
    page,
    scene,
    record_id
}) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: '/webapi/mini/code',
            type: 'post',
            data: {
                page,
                scene,
                record_id
            },
            success: res => {
                if (res.code === 0) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }
        })
    })
}

// buffer流转base64
window.transformArrayBufferToBase64 = function (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return "data:image/png;base64," + window.btoa(binary)
}

/**
* 获取location历史页面
* */
window.historyHasPrev = function () {
    /*
    * 这里存的方法在assets/commonJs/reloadPage中统一记录
    * */
    document.referrer === ''
        ? window.location.href = '/wap/'
        : window.location.replace(JSON.parse(window.localStorage.getItem('oldUrl'))[0])
}

/**
 * 获取url参数对象
 * */
window.getUrlVars = function () {
    var url = decodeURIComponent(location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            var tempArr = strs[i].split("=");
            // 类型转换
            if (tempArr[1] == 'true') {
                tempArr[1] = true;
            }
            if (tempArr[1] == 'false') {
                tempArr[1] = false;
            }
            if (/^[\d|.]+$/.test(tempArr[1])) {
                tempArr[1] = Number(tempArr[1]);
            }
            // 写入对象
            if (tempArr[0].search(/\[.*]/) == -1) {
                theRequest[tempArr[0]] = tempArr[1];
            } else {
                // 数组
                var key = tempArr[0].replace(/\[.*]/, '');
                if (!theRequest[key]) {
                    theRequest[key] = [tempArr[1]];
                } else {
                    theRequest[key].push(tempArr[1]);
                }
            }
        }
    }
    return theRequest;
}
//替换指定传入参数的值,key为参数,value为新值
window.replaceParamVal = function (key, value, url) {
    let uri = url || window.location.href
    if (String(value) !== '0' && !value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    console.log('uri.match(re)', uri.match(re))
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

// 删除指定的参数名
window.removeURLParameter = function (parameter, url) {
    url = url || window.location.href
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
        //参数名前缀
        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);
        //循环查找匹配参数
        for (var i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                //存在则删除
                pars.splice(i, 1);
            }
        }
        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}
//替换指定传入参数的值,key为参数,value为新值
window.replaceParamVal = function (key, value, url) {
    let uri = url || window.location.href
    if(!value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    console.log('uri.match(re)', uri.match(re))
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}
// 复制手机号到剪切板
window.onCopyPhone = function (number) {
    let input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', number);
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        Toast('复制成功')
    }
    document.body.removeChild(input);
}
// 判断当前打开的浏览器
window.findBrowser = (function () {
    var browser = {
        versions: function () {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    const theBrowser = {
        prot: '', // 在哪个端打开的 PC/Mobile
        system: '', // 若为Mobile，此分辨是IOS还是Android
        app: '' // 若为Mobile，此分辨是哪个App打开
    }
    if (browser.versions.mobile) { //判断是否是移动设备打开。
        theBrowser.prot = 'mobile'
        var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //在微信中打开
            theBrowser.isWechat = true
        }
        if (ua.match(/WeiBo/i) == "weibo") {
            //在新浪微博客户端打开
            theBrowser.isWebo = true
        }
        if (ua.match(/QQ/i) == "qq") {
            //在QQ空间打开
            theBrowser.isQQ = true
        }
        if (browser.versions.ios) {
            //是否在IOS浏览器打开
            theBrowser.isIOS = true
        }
        if (browser.versions.android) {
            //是否在安卓浏览器打开
            theBrowser.isAndroid = true
        }
    } else {
        //否则就是PC浏览器打开
        theBrowser.prot = 'mobile'
    }
    return theBrowser
})()



/*-----------------------------------工具类方法start------------------------------------*/
/**
 * 微信登录获取code码
 */
window.onGetLoginCode = function ({ appid = window.APP_ID, path = '', scope }) {
    const { origin, href } = window.location
    const url = encodeURIComponent(`${path ? origin + path : href }}`)
    const timestamp = new Date().getTime()
    const wechatUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=${scope}&state=${timestamp}#wechat_redirect`
    window.location.replace(wechatUrl)
}

/**
 * 跳转课程详情
 * */
window.onGetCourseDetail = function ({course_type, course_id}) {
    let url = ''
    switch (course_type) {
        case 1:
            url = `/wap/courses/${course_id}`
            break;
        case 2:
            url = `/wap/live-courses/${course_id}`
            break;
        default:
            console.error('请检查课程类型')
    }
    window.location.href = url
}
/*-----------------------------------工具类方法end------------------------------------*/
