<template>
    <div :class="{
        'component-btn': true,
         'big-btn': type === 'big',
         'default-btn': type === 'default',
         'small-btn': type === 'small',
         'is-btn-disable': isDisable }"
         @click="onClickBtn"
    >{{ text }}</div>
</template>

<script>
    export default {
        name: "button",
        props: {
            text: {
                default: '',
                type: String
            },
            isDisable: {
                default: false,
                type: Boolean
            },
            type: {
                default: 'big', // 有big，default， small三种样式
                type: String
            }
        },
        methods: {
            onClickBtn () {
                if (this.isDisable) return
                this.$emit('btn-click')
            }
        }
    }
</script>

<style lang="less" scoped>
@import "../assets/commonCss/base";
.component-btn {
    background: @color-main-style;
    border-radius: 8px;
    font-size: 30px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
}
.big-btn {
    width: 686px;
    height: 96px;
}
.default-btn {
    width: 610px;
    height: 88px;
}
.small-btn {

}
.is-btn-disable {
    background: #DEE0E5;
}
</style>