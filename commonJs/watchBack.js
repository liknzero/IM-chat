
/**
 * 监听界面是否被显示
 * */
$(function () {
    let hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
            'mozHidden' in document ? 'mozHidden' :
                null;
    let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    let onVisibilityChange = function(){
        if (document[hiddenProperty]) {
            console.log('页面非激活');
        }else{
            // alert('页面激活')
            console.log('页面激活')
            onPageShow()
        }
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
})