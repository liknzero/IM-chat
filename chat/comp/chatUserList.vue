<template>
<li @click="onGetChatFunc" :class="{'chat-user-list': true, 'chat-user-active': chatChoose && chatInfo.friendId === chatChoose.friendId}">
    <p class="user-avatar-box">
        <i v-if="!chatInfo.readTime "></i>
        <img class="user-avatar" :src="chatInfo.friendUrl" alt="">
    </p>
    <p class="user-chat">
        <span class="chat-user">
            <span class="chat-user-name">{{ chatInfo.friendName }}</span>
            <span class="chat-user-time">{{ chatInfo.timestamp | calculate }}</span>
        </span>
        <span class="chat-msg" v-if="chatInfo.type === 'TEXT'">{{ chatInfo.content }}</span>
        <span class="chat-msg" v-if="chatInfo.type === 'IMAGE'">{{ '[图片]' }}</span>
        <span class="chat-msg" v-if="chatInfo.type === 'NEWS'">{{ chatInfo.content.publish_type === 1 ? '[商品信息]' : '[求购信息]' }}</span>
    </p>
</li>
</template>

<script>
import { calculateTime } from '../../../../libs/time'
export default {
    data () {
        return {

        }
    },
    props: {
        // 当前被选中的好友
        chatChoose: {
            type: Object,
            default: () => {}
        },
        // 遍历的数据本身
        chatInfo: {
            type: Object,
            default: () => {}
        }
    },
    filters: {
        calculate (time) {
            return time ? calculateTime(time / 1000) : ''
        }
    },
    methods: {
        onGetChatFunc () {
            this.$emit('on-get-chat-func', this.chatInfo)
        }
    }

}
</script>

<style lang="less" scoped>
@import "../../../../static/css/base.less";

.chat-user-list {
    height: 70px;
    padding: 12px 15px;
    display: flex;
    cursor: pointer;
    &:hover {
        background: #F4F4F5;
    }
    .user-avatar-box {
        position: relative;
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 12px;
        }
        i {
            position: absolute;
            background: #FB304B;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            right: 12px;
        }
    }
    .user-chat {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        font-size:@font-size-12;
        color:@color-font-second;
        .chat-user {
            justify-content: space-between;
            line-height: 25px;
            .line-clamp(1);
            display: flex;
            .chat-user-name {
                font-size: @font-size-14;
                font-weight: 500;
                color:@color-font-first;
            }
        }
        .chat-msg {
            line-height: 20px;
            .line-clamp(1);
        }
    }
}
.chat-user-active {
    background: #F4F4F5;
}
</style>