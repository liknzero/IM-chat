<template>
    <div class="empty-box">
        <img class="empty-img" src="/pc-images/icon-empty-chat.png" alt="">
        <p class="empty-txt">
            <span>Tips：</span>您30天内所有沟通都在左侧列表中显示
        </p>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "../../../../static/css/base.less";

.empty-box {
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
    padding-top: 165px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    background: #ffffff;
    .empty-img {
        width: 120px;
        height: 120px;
    }            
    .empty-txt {
        padding-top: 32px;
        font-size:@font-size-12;
        color:#AFAFB3;
        span {
            font-size: @font-size-14;
            color: @color-font-find-second;
        }
    }
}
</style>