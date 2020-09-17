$(function () {
    if (!window.findBrowser.isWechat) return false
    const { href: url, origin } = window.location
    Ajax({
        url: '/wap/share-to-wechat',
        type: 'get',
        data: { url }
    }).then(result => {
        console.log(result)
        const { app_id: appId, noncestr: nonceStr, jsapi_ticket, timestamp, url: link, signature, title, description: desc, image: imgUrl = `${origin}/waps/images/icon-share-cover.png`} = result.data.data
        wx.config({
            debug: false, // 开启调试模式
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature,// 必填，签名
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
            wx.updateAppMessageShareData({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl, // 分享图标
                success: function () {
                    // 设置成功
                }
            });
            wx.updateTimelineShareData({
                title, // 分享标题
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl, // 分享图标
                success: function () {
                    // 设置成功
                }
            })
        });

        wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
    }).catch(err => {
        console.log(err.message)
    })
})