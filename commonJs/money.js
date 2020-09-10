import { Toast } from 'vant'

export const conformOrder = (params, callback) => {
    Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '提交订单...'
    })
    params.client_type = getClientType(params)
    Ajax({
        url: '/wap/create-order',
        type: 'post',
        data: params
    }).then(res => {
        const data = res.data.data
        payOrder({...data, ...params }, callback)
    }).catch(err => {
        Toast(err.message)
    })
}
export const payOrder = ({order_no, client_type = '', payment_channel}, callback) => {
    Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '支付中...'
    })
    client_type = getClientType(payment_channel)
    Ajax({
        url: '/wap/pay-for-order',
        type: 'post',
        data: {
            order_no, client_type, payment_channel
        }
    }).then(res => {
        const data = res.data.data
        callback(data)
        switch (payment_channel) {
            case 2:
                // 调起微信支付
                if (client_type === 6) {
                    // 在微信内调用支付
                    onBridgeReady(data)
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
    }).catch(err => {
        Toast(err.message)
    })
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
export const onBridgeReady = (data) => {
    const {appid: appId, timeStamp, nonceStr, package: pack, signType, paySign} = data
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
            } else {
                Toast('支付失败')
            }
        });
}
/*
* 这里要立即执行，若在微信app内，全局监听支付
* */
wechatBridgePay()
function wechatBridgePay () {
    if (!window.findBrowser.isWechat) {
        console.log('not weixin');
        return
    }
    if (typeof window.WeixinJSBridge === 'undefined') {
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
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