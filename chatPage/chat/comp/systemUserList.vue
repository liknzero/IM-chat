<template>
    <li @click="onGetChatFunc" :class="{'chat-user-list': true, 'chat-user-active': systemChoose && systemChoose.systemId === systemInfo.systemId}">
        <p class="user-avatar-box">
            <i v-if="!systemInfo.readTime"></i>
            <img class="user-avatar" :src="systemInfo.systemAvatar" alt="">
        </p>
        <p class="user-chat">
        <span class="chat-user">
            <span class="chat-user-name">{{ systemInfo.title }}</span>
            <span class="chat-user-time">{{ systemInfo.timestamp | calculate }}</span>
        </span>
        <span class="chat-msg">{{ systemInfo.content }}</span>
        </p>
    </li>
</template>

<script>
    import { calculateTime } from '../../../../libs/time'
    export default {
        name: "systemUserList",
        props: {
            // 当前被选中的好友
            systemChoose: {
                type: Object,
                default: () => {}
            },
            // 遍历的数据本身
            systemInfo: {
                type: Object,
                default: () => {}
            }
        },
        filters: {
            calculate (time) {
                return calculateTime(time / 1000)
            }
        },
        methods: {
            onGetChatFunc () {
                this.$emit('on-get-chat-func', this.systemInfo)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>