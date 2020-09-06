<template>
    <div class="empty">
        <img :src="img" alt="">
        <div class="txt">{{ txt }}</div>
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
            }
        },
        data () {
            return {
            }
        }
    }
</script>

<style lang="less" scoped>
    .empty {
        position: absolute;
        top: 0;
        z-index: 100;
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
    }
</style>
