(function () {
    // 获取用户信息
    Ajax({
        url: '/wap/get-user-detail'
    }).then(res => {
        window.localStorage.setItem('userInfo', JSON.stringify(res.data.data))
    }).catch(err => {
        console.log(err)
    })
})()
