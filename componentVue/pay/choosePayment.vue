<template>
    <van-action-sheet
            v-model="showPay"
            safe-area-inset-bottom
            cancel-text="取消"
            close-on-click-action
            @cancel="showPay = false"
    >
        <div class="radio-title">选择支付方式</div>
        <van-radio-group v-model="radio" @change="onChangeRadio">
            <van-cell-group>
                <van-cell
                        v-for="item in actionPay"
                        :key="item.pay"
                        clickable
                        @click="radio = item.pay"
                >
                    <template #icon>
                        <van-icon :name="item.icon" />
                    </template>
                    <template #title>
                        <div>{{item.name}}</div>
                    </template>
                    <template #right-icon>
                        <van-radio checked-color="#F078A2" :name="item.pay" />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </van-action-sheet>
</template>

<script>
    export default {
        name: "choosePayment",
        data () {
            return {
                radio: null,
                actionPay: [
                    {
                        pay: 2,
                        name: '微信支付',
                        icon: '/waps/images/icon-pay-wechat.png'
                    },
                ],
                showPay: false
            }
        },
        props: {
            needDefault: {
                type: Boolean,
                default: true
            }
        },
        created () {
            const browser = window.findBrowser
            if (!browser.isWechat) {
                this.actionPay.push({
                    pay: 3,
                    name: '支付宝支付',
                    icon: '/waps/images/icon-pay-ali.png'
                })
            }
            // 选择默认支付方式
            if (this.needDefault) {
                this.radio = this.actionPay[0].pay
                this.$emit('change-radio', this.actionPay[0])
            }
        },
        methods: {
            onChangeRadio (event) {
                this.showPay = false
                if (!event && String(event) !== '0') return
                const pay = this.actionPay.find(item => item.pay === event)
                this.$emit('change-radio', pay)
            }
        }
    }
</script>

<style lang="less" scoped>

    .radio-title {
        height: 96px;
        line-height: 96px;
        font-size: 32px;
        font-weight: bold;
        color: #303033;
        padding: 0 30px;
    }
    .van-radio-group {
        .van-cell {
            padding: 30px 30px;
        }
        .van-icon {
            .van-icon__image {
                width: 40px;
                height: 40px;
                padding-right: 20px;
            }
        }
        .van-cell__title {
            font-size: 30px;
            color: #303033;
        }
    }
</style>