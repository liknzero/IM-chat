<template>
    <div class="chat-top-product">
        <template v-if="productInfo.file_type === 2">
            <img class="top-product-img" :src="productInfo.image" alt="">
        </template>
        <template v-if="productInfo.file_type === 3">
            <img class="top-product-img" :src="productInfo.image + '?x-oss-process=video/snapshot,t_0,f_jpg,m_fast'" alt="">
        </template>
        <div class="top-product-info">
            <p class="top-product-content">{{ productInfo.text }}</p>
            <div class="product-bottom">
                <span class="top-product-type">{{ productInfo.publish_type === 1 ? '#商品' : '#求购' }}</span>
                <button type="button" class="btn btn-primary" @click="onSendGoodsCard">立即咨询</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        productInfo: {
            type: Object,
            default: () => { return {} }
        }
    },
    methods: {
        onSendGoodsCard () {
            this.$emit('on-sent-msg', this.productInfo, 'NEWS')
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../../static/css/base.less";

.chat-top-product {
    position: absolute;
    width: 100%;
    height: 160px;
    z-index: 1;
    padding: 16px 16px 24px;
    background: #ffffff;
    box-shadow:0px 2px 4px 0px rgba(231,231,231,0.5);
    display: flex;
    .top-product-img {
        width: 120px;
        height: 120px;
        flex-shrink: 0;
        object-fit: cover;
    }
    .top-product-info {
        flex-grow: 1;
        padding-left: 12px;
        font-size:@font-size-14;
        color:@color-font-find-second;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .product-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .top-product-type {
                font-size:12px;
                color:@color-font-find-second;
            }
            .btn-primary {
                width:120px;
                height:36px;
                font-size:@font-size-12;
                color: #ffffff;
                background: @color-main-btn;
                border-color: @color-main-btn;
            }
        }
    }
}
</style>