<template>
    <div class="empty" :style="{position: isPosition ? 'absolute' : 'relative', minHeight: minHeight }">
        <img :src="img" alt="">
        <div class="txt">{{ txt }}</div>
        <div v-if="showBtn" class="empty-btn" @click="onClickEmpty">{{ btnTxt }}</div>
    </div>
</template>

<script>
    export default {
        name: 'EmptyImg',
        props: {
            txt: {
                default: '什么都没有哦',
                type: String
            },
            img: {
                default: '',
                type: String
            },
            btnTxt: {
                default: '去登录',
                type: String
            },
            showBtn: {
                default: false,
                type: Boolean
            },
            // 是否需要定位
            isPosition: {
                default: false,
                type: Boolean
            },
            // 最小高度，需要带单位
            minHeight: {
                default: '',
                type: String
            }
        },
        data () {
            return {
            }
        },
        methods: {
            onClickEmpty () {
                this.$emit('empty-btn')
            }
        }
    }
</script>

<style lang="less" scoped>
    .empty {
        /*position: relative;*/
        /*position: absolute;*/
        top: 0;
        /*z-index: 100;*/
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        background-color: #fff;
        .txt {
            font-size:28px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(150,150,153,1);
        }
        img {
            padding-top: 340px;
            width: 320px;
            height: 320px;
        }
        .empty-btn {
            margin-top: 36px;
            width: 264px;
            height: 80px;
            line-height: 80px;
            text-align: center;
            background: #F8729A;
            border-radius: 8px;
            font-size: 28px;
            color: #FFFFFF;
        }
    }
</style>
