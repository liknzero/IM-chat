<template>
    <div class="chat-info">
        <div class="chat-info-left" @scroll="onScrollGetMoreSystem">
            <ul>
                <system-user
                        v-for="item in messageList"
                        :system-choose="messageChoose"
                        :system-info="item"
                        :key="item.id"
                        @on-get-chat-func="onGetChatDetails"
                ></system-user>
            </ul>
        </div>
        <div class="chat-info-right">
            <!-- 未选择任何聊天时展示窗口 -->
            <chat-empty v-if="!messageChoose"></chat-empty>
            <!-- 聊天窗口 -->
            <div v-else class="system-room">
                <div class="system-title-box">
                    <p class="system-title">{{ messageChoose.title }}</p>
                    <p class="system-time">{{ messageChoose.timestamp | calculate }}</p>
                    <p class="system-content">{{ messageChoose.content }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SystemUser from './comp/systemUserList'
import ChatEmpty from './comp/chatEmpty'
import { calculateTime } from '../../../libs/time'
import { createSystemMessage } from '../../../libs/socket'
import { onScrollView } from '../../../libs/util'

export default {
    data () {
        return {
            systemAvatar: '/pc-images/icon-system-avatar.png',
            messageList: [],
            messageChoose: null,
            messageParams: {
                page: 1,
                size: 15,
                isEmpty: false,
                isNoMore: false,
                isLoading: false
            }
        }
    },
    inject: [ 'childUserInfo', 'defaultAvatar' ],
    components: {
        ChatEmpty,
        SystemUser
    },
    created () {
        this.onGetSystemList(this.messageParams)
    },
    filters: {
        calculate (time) {
            return calculateTime(time / 1000)
        }
    },
    methods: {
        // 系统消息列表
        onGetSystemList ({ page, size }) {
            if (this.messageParams.isEmpty) return false
            if (this.messageParams.isLoading) return false
            if (this.messageParams.isNoMore) return false
            this.messageParams.isLoading = true
            Ajax({
                url: '/webapi/user/system_message',
                type: 'get',
                data: { page, size },
                success: res => {
                    if (res.code === 0) {
                        let data = res.data.data
                        let meta = res.data.meta.pagination
                        if (!meta.has_next) {
                            this.messageParams.isNoMore = true
                            if (meta.current_page === 1 && !data.length) {
                                this.messageParams.isEmpty = true
                                return false
                            }
                        }
                        this.messageParams.page += 1
                        data = data.map(item => this.onFormatSystem(item))
                        if (meta.current_page === 1) {
                            this.messageList = data
                        } else {
                            this.messageList = [...this.messageList, ...data]
                        }
                    } else {
                        this.$message.error(res.message)
                    }
                },
                complete: () => {
                    this.messageParams.isLoading = false
                }
            })
        },
        // 获取更多消息列表
        onScrollGetMoreSystem (event) {
            if (onScrollView(event) === 'bottom') this.onGetSystemList(this.messageParams)
        },
        // 切换系统消息详情
        onGetChatDetails (item) {
            this.messageChoose = item
            console.log(this.messageChoose)
            this.onMarkMsgRead(this.messageChoose)
        },
        // 格式化系统消息
        onFormatSystem (item) {
            return createSystemMessage({
                systemId: item.id,
                systemAvatar: this.systemAvatar,
                title: item.title,
                content: item.content,
                readTime: item.read_time || null,
                timestamp: item.created_at * 1000
            })
        },
        // 收到系统消息
        onReceiveSystem (msg) {
            this.messageList.unshift(msg)
        },
        // 标记系统消息已读
        onMarkMsgRead ({ systemId: record_id }) {
            Ajax({
                url: '/webapi/read',
                data: {
                    record_id,
                    type: 'system'
                },
                type: 'post',
                success: res => {
                    if (res.code === 0) {
                        // 消息置为已读
                        const time = Date.now()
                        this.messageList.find(item => {
                            if (item.systemId === record_id) {
                                item.readTime = time
                            }
                        })
                    } else {
                        console.log('消息未读')
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
@import "../../../static/css/base.less";

.system-room {
    padding: 0 20px;
    .system-title-box {
        height: 75px;
        padding-top: 25px;
        .system-title {
            line-height: 24px;
            font-size:16px;
            font-weight:bold;
            color: @color-font-first;
        }
        .system-time {
            line-height: 29px;
            font-size:12px;
            color: #AFAFB3;
        }
        .system-content {
            line-height: 24px;
            font-size:14px;
            color: @color-font-first;
        }
    }
}
</style>