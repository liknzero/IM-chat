<template>
    <div>
        <div class="order-list-box" v-for="item in orderArr">
            <div class="order-info">
                <div class="order-info-left">
                    <p class="order-number">订单编号: 465462165465136164654</p>
                    <p class="order-time">20202020202020202</p>
                </div>
                <div class="order-info-right">
                    <div v-if="false" class="order-status">待支付</div>
                    <div v-else class="order-status">
                        交易成功
                        <i></i>
                        <img src="/waps/images/icon-delete-order.png" alt="">
                    </div>
                </div>
            </div>
            <div class="order-list">
                <div class="order-item">
                    <img src="/waps/images/icon-empty-collection.png" alt="" class="order-course-cover">
                    <p class="order-course-content">亚马逊运营需要学习哪些知识点快来学习这节课揭发背后的秘密哈哈哈哈啊哈哈背后的秘密哈哈哈哈啊哈哈</p>
                    <span class="order-course-price">¥ 1234</span>
                </div>
            </div>
            <div class="order-pay">实付：<span>¥323.00</span></div>
            <div class="order-pay-btn">
                <span class="cancel-btn">取消订单</span>
                <span class="pay-btn">去支付</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "order",
        props: {
            orderArr: {
                type: Array,
                default: () => []
            }
        }
    }
</script>

<style lang="less" scoped>
@import "../../assets/commonCss/base";
.order-list-box {
    margin-top: 20px;
    background: #ffffff;
    .order-info {
        height: 112px;
        padding: 0 30px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24px;
        &:after {
            .border-bottom-1px(#EBEBEB);
        }
        .order-info-left {
            .order-number {
                font-size: 28px;
                color: #2C2C33;
            }
            .order-time {
                color: #A8A8B3;
            }
        }
        .order-info-right {
            color: #F078A2;
            .order-status {
                display: flex;
                align-items: center;
                &>i {
                    display: inline-block;
                    width: 1px;
                    height: 20px;
                    background: #D8D8D8;
                    margin-left: 20px;
                }
                &>img {
                    width: 32px;
                    height: 32px;
                    padding: 20px 0 20px 20px;
                }
            }
        }
    }
    .order-list {
        .order-item {
            padding: 25px 30px;
            display: flex;
            justify-content: space-between;
            .order-course-cover {
                width: 220px;
                height: 124px;
                border-radius: 4px;
                object-fit: cover;
            }
            .order-course-content {
                font-size: 26px;
                line-height: 42px;
                color: #303033;
                padding: 0 30px 0 20px;
                .line-clamp(3);
            }
            .order-course-price {
                flex-shrink: 0;
                font-size: 24px;
                color: #2C2C33;
            }
        }
    }
    .order-pay {
        height: 72px;
        line-height: 72px;
        text-align: right;
        font-size: 24px;
        color: #2C2C33;
        padding: 0 30px;
        &>span {
            font-size: 28px;
            font-weight: bold;
            color: #2C2C33;
        }
    }
    .order-pay-btn {
        height: 100px;
        font-size: 28px;
        color: #5D5D66;
        padding: 0 30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &>span {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .pay-btn {
            width: 146px;
            height: 64px;
            margin-left: 20px;
            color: #ffffff;
            background: #F078A2;
            box-shadow: 0px 2px 13px 0px rgba(255, 192, 215, 0.95);
            border-radius: 4px;
        }
        .cancel-btn {
            width: 176px;
            height: 64px;
            color: #5D5D66;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #D9D9D9;
        }
    }

}
</style>