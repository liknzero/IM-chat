import { Toast } from 'vant'

/*
* !!!!! 这里是设置微信支付全局状态，和获取微信支付code码
* */
(function () {
    if (!window.findBrowser.isWechat) {
        console.log('not weixin');
        return
    }
    if (!window.getUrlVars()['code'] && !window.getUrlVars()['needCode']) {
        // 先添加needcode参数，防止用户返回上一页时，重复请求code
        window.history.replaceState(null, null, window.replaceParamVal('needCode', 1));
        window.onGetLoginCode({ scope: 'snsapi_base' })
        setTimeout(() => {
            // 防止页面code超时，重新请求code
            window.onGetLoginCode({ scope: 'snsapi_base' })
        }, 5 * 60 * 1000)
    }
})();


/*
* 创建订单界面调用支付
* 生成订单以后直接唤起支付
* */
export const conformOrder = (params, callback) => {
    Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '提交订单...'
    })
    params.client_type = getClientType(params)
    if (params.client_type === 6) params.code = window.getUrlVars()['code']
    Ajax({
        url: '/wap/create-order',
        type: 'post',
        data: params
    }).then(res => {
        const data = res.data.data
        callback(data)
        awakeToPay(data, params)
    }).catch(err => {
        callback(err)
        Toast(err.message)
    })
}
/*
* 个人订单界面订单支付
* 已存在的订单，选择支付方式后，唤起相应支付方式
* */
export const payOrder = ({order_no, client_type = '', payment_channel}, callback) => {
    Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '支付中...'
    })
    const params = { order_no, client_type, payment_channel }
    params.client_type = getClientType({payment_channel})
    if (params.client_type === 6) params.code = window.getUrlVars()['code']
    Ajax({
        url: '/wap/pay-for-order',
        type: 'post',
        data: params
    }).then(res => {
        const data = res.data.data
        callback(data)
        awakeToPay(data, params)
    }).catch(err => {
        callback(err)
        Toast(err.message)
    })
}
/*
* 获取订单以后唤起支付
* */
function awakeToPay (data, { payment_channel, client_type }) {
    switch (payment_channel) {
        case 2:
            // 调起微信支付
            if (client_type === 6) {
                // 在微信内调用支付
                onBridgeWechatPay(data)
            } else {
                // 在微信外调用支付
                wechatWapPay(data)
            }
            break
        case 3:
            // 支付宝支付
            aliWapPay(data)
            break
        default:
            console.error('请检查支付类型')
    }
}


/*
* 这里的params中要判断client_type
*
* */
function getClientType ({ payment_channel }) {
    return payment_channel === 2 &&  window.findBrowser.isWechat
        ? 6 // 微信内支付// 状态6
        : 4 // 微信外支付// 支付宝支付// 状态4
}

/*
* 微信内微信支付
* data: 后台返回的参数
* 微信app内支付会通过jsBridge唤起微信app原生方法，传入相关参数，回调方法内去查询订单状态
* */
function onBridgeWechatPay(data) {
    function onBridgeReady() {
        const {appId, timeStamp, nonceStr, package: pack, signType, paySign, order_no} = data
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                appId,     //公众号名称，由商户传入
                timeStamp,//时间戳，自1970年以来的秒数
                nonceStr, //随机串
                package: pack, // 这样写是和全局的命名冲突
                signType,         //微信签名方式：
                paySign  //微信签名
            },
            function (res) {
                if(res.err_msg == "get_brand_wcpay_request:ok" ){
                    console.log('前往查询订单支付状态')
                    window.location.href = `/wap/payment/wechat/return?out_trade_no=${order_no}`
                } else {
                    Toast('支付失败')
                }
            });
    }
    // 若在微信app内，全局监听支付
    if (typeof window.WeixinJSBridge === 'undefined') {
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady()
    }
}
/*
* 微信外微信支付
* data: 订单创建以后后台返回的相关参数值
* 微信外支付是跳转到微信url，支付成功以后跳转回redirect_url查询支付状态
* */
export const wechatWapPay = (data) => {
    const { origin } = window.location
    const redirect = encodeURIComponent(`${origin}/wap/payment/wechat/return?out_trade_no=${data.order_no}`)
    const url = `${data.redirect_url}&redirect_url=${redirect}`
    window.location.replace(url)
}

export const aliWapPay = (data) => {
    let { order_str } = data
    // 这里后台返回的json数据中带有反斜杠，去除反斜杠操作
    order_str = order_str.replace(/[\\]/g, '')
    $('body').append(order_str)
}
export default {
    conformOrder,
    payOrder
}