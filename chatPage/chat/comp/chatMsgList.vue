<template>
    <li>
        <div class="chat-message">
            <p v-if="chatItem.isShowTime" class="message-time">{{ chatItem.timestamp | calculate }}</p>
            <div :class="{'message-box': true, 'message-my-self': chatItem.isMySelf}" :id="'chat-item-' + chatItem.chatId">
                <div class="avatar" v-if="!chatItem.isMySelf">
                    <img :src="chatItem.friendUrl" alt="" class="message-avatar">
                </div>
                <div class="message-content">
                    <div class="text" v-if="chatItem.type === 'TEXT'">{{chatItem.content}}</div>
                    <img class="msg-image" v-else-if="chatItem.type === 'IMAGE'" :src="chatItem.content"/>
                    <div class="msg-product" v-else-if="chatItem.type === 'NEWS'">
                        <template v-if="chatItem.content.file_type == 2 && chatItem.content.image">
                            <img class="msg-product-img" :src="chatItem.content.image" alt="">
                        </template>
                        <template v-if="chatItem.content.file_type == 3 && chatItem.content.image">
                            <img class="msg-product-img" :src="chatItem.content.image + '?x-oss-process=video/snapshot,t_0,f_jpg,m_fast'" alt="">
                        </template>
                        <p class="msg-product-content">{{ chatItem.content.publish_type === 1 ? '#商品' : '#求购'}}&nbsp;{{ chatItem.content.text }}</p>
                    </div>
                </div>
                <div class="avatar" v-if="chatItem.isMySelf">
                    <img :src="chatItem.myHeader" alt="" class="message-avatar">
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import { calculateTime } from '../../../../libs/time'

export default {
    props: {
        chatItem: {
            type: Object,
            default: () => {}
        }
    },
    filters: {
        calculate (time) {
            return calculateTime(time / 1000)
        }
    },
    mounted () {
    },
    methods: {

    }

}
</script>

<style lang="less" scoped>
@import "../../../../static/css/base.less";

.chat-message {
    .message-time {
        line-height: 37px;
        text-align: center;
        font-size:@font-size-12;
        color:@color-font-find-first;
    }
    .message-box {
        display: flex;
        padding-top: 10px;
        .avatar {
            display: inline-block;
            margin-right: 12px;
            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }
        }
        .message-content {
            display: inline-block;
            font-size:@font-size-14;
            color:@color-font-find-first;
            background: #ffffff;
            border-radius:4px;
            box-shadow:0px 2px 4px 0px rgba(219,219,219,0.5);
            .text {
                max-width: 400px;
                padding: 8px 15px;
            }
            .msg-image {
                max-width: 300px;
                min-height: 300px;
            }
            .msg-product {
                max-width: 162px;
                padding: 16px;
                .msg-product-img {
                    width: 132px;
                    height: 132px;
                    object-fit: cover;
                }
                .msg-product-content {
                    padding-top: 8px;
                    font-size:@font-size-12;
                    .line-clamp(3);
                }
            }
        }
    }
    .message-my-self {
        justify-content: flex-end;
        .avatar {
            margin-right: 0;
            margin-left: 12px;
        }
    }
}
</style>