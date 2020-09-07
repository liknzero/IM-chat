<template>
    <div class="order-list">
        <div class="order-list-title">跨境知道</div>
        <div
                class="collection-cell"
                @click="linkTo(item)"
        >
            <img
                    class="order-cover"
                    :src="'/waps/images/icon-default-avatar.png'"
                    mode="aspectFill"
                    alt=""
            >
            <div class="collec-cell-rt">
                <div class="cell-rt-title">{{ '啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方' }}</div>
                <span class="cell-rt-num">
                    <span>¥{{45894}}</span>&nbsp;
                    <span class="cell-num-out">¥{{45894}}</span>
                </span>
            </div>
        </div>
        <div
                class="collection-cell"
                @click="linkTo(item)"
        >
            <img
                    class="order-cover"
                    :src="'/waps/images/icon-default-avatar.png'"
                    mode="aspectFill"
                    alt=""
            >
            <div class="collec-cell-rt">
                <div class="cell-rt-title">{{ '啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方啊手动阀第三方' }}</div>
                <span class="cell-rt-num">
                    <span>¥{{45894}}</span>&nbsp;
                    <span class="cell-num-out">¥{{45894}}</span>
                </span>
            </div>
        </div>
        <div class="order-all-num">小计：¥{{320.00}}</div>
    </div>
</template>

<script>
    export default {
        name: "orderList",
        methods: {
            linkTo () {

            }
        }
    }
</script>

<style lang="less" scoped>
@import "../../assets/commonCss/base";
.order-list {
    padding: 0 30px;
    background: #ffffff;
    margin-bottom: 20px;
    .order-list-title {
        height: 72px;
        line-height: 72px;
        font-size: 24px;
        color: #909099;
    }
    .collection-cell {
        padding: 28px 0;
        position: relative;
        display: flex;
        &:after {
            .border-bottom-1px(#EBEBEB);
        }
        .order-cover {
            width: 200px;
            height: 112px;
            object-fit: cover;
        }
        .collec-cell-rt {
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .cell-rt-title {
                font-size: 28px;
                font-weight: bold;
                color: #303033;
                .line-clamp(2);
            }
            .cell-rt-num {
                font-size: 24px;
                color: #2C2C33;
                .cell-num-out {
                    color: #A8A8B3;
                    text-decoration:line-through
                }
            }
        }
    }
    .order-all-num {
        height: 88px;
        line-height: 88px;
        font-size: 28px;
        font-weight: bold;
        color: #2C2C33;
        padding: 0 30px;
        text-align: right;
    }
}
</style>