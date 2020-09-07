<template>
    <van-action-sheet
            v-model="showPay"
            safe-area-inset-bottom
            cancel-text="取消"
            close-on-click-action
            @cancel="onCancel"
    >
        <div class="radio-title">选择支付方式</div>
        <van-radio-group v-model="radio">
            <van-cell-group>
                <van-cell
                        v-for="item in actionPay"
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
    // TODO: 这里要做支付状态的筛选和选择状态的监听
    export default {
        name: "choosePayment",
        data () {
            return {
                actionPay: [
                    {
                        pay: 2,
                        name: '微信支付(推荐）',
                        icon: '/waps/images/icon-pay-wechat.png'
                    },
                    {
                        pay: 3,
                        name: '支付宝支付',
                        icon: '/waps/images/icon-pay-ali.png'
                    },
                ]
            }
        },
        props: {
            radio: {
                type: Number,
                default: 0
            },
            showPay: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped>

</style>