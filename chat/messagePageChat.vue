<template>
  <div class="chat-info">
    <div class="chat-info-left" @scroll="onGetMoreChatList">
        <ul>
            <chat-user
                    v-for="item in chatArrList"
                    :chat-choose="chatShowInfo"
                    :chat-info="item"
                    :key="item.id"
                    @on-get-chat-func="onGetChatDetails"
            ></chat-user>
        </ul>
    </div>
    <div class="chat-info-right">
        <!-- 未选择任何聊天时展示窗口 -->
        <chat-empty v-if="!chatShowInfo"></chat-empty>
        <!-- 聊天窗口 -->
        <div v-else class="chat-room">
            <!-- 主题卡片数据 -->
            <product-theme
                    v-if="productTheme && ~~productTheme.accept_user === chatShowInfo.friendId"
                    :product-info="productTheme"
                    @on-sent-msg="onSendMsg"
            ></product-theme>
            <!-- 聊天列表 -->
            <div class="chat-content" ref="chatContent" id="chatContent" @scroll="onGetMoreChatItem">
                <ul>
                    <chat-msg-list
                            ref="chatMsg"
                            v-for="item in chatItemList"
                            :chat-item="item"
                            :key="item.chatId"
                    ></chat-msg-list>
                </ul>
            </div>
            <chat-input ref="chatInput" @on-sent-msg="onSendMsg"></chat-input>
        </div>
    </div>
</div>
</template>

<script>
import ProductTheme from './comp/productTheme'
import ChatUser from './comp/chatUserList'
import ChatEmpty from './comp/chatEmpty'
import ChatMsgList from './comp/chatMsgList'
import ChatInput from './comp/chatInput'
import { createMessage } from '../../../libs/socket'
import { insertTimeItemToCurrentMessageList } from '../../../libs/time'
import { onScrollView } from '../../../libs/util'
export default {
    data () {
        return {
            chatArrList: [],
            chatItemList: [],
            productTheme: null,
            chatShowInfo: null,
            chatUserParams: {
                size: 15,
                page: 1,
                isEmpty: false,
                isLoading: false,
                isNoMore: false
            },
            chatMsgParams: {
                size: 20,
                page: 1,
                isEmpty: false,
                isLoading: false,
                isNoMore: false
            },
        }
    },
    inject: [ 'childUserInfo', 'defaultAvatar' ],
    components: {
        ChatUser,
        ChatInput,
        ChatEmpty,
        ChatMsgList,
        ProductTheme
    },
    created () {
        this.productTheme = getUrlVars()
        if (this.productTheme && this.productTheme['pub_content_id']) {
            this.productTheme['text'] = decodeURIComponent(this.productTheme['text'])
            this.productTheme['nickname'] = decodeURIComponent(this.productTheme['nickname'])
        } else {
            this.productTheme = null
        }
        this.onGetChatList(this.chatUserParams)
    },
    methods: {
        // 获取当前用户好友列表
        onGetChatList ({ page, size }) {
            if (this.chatUserParams.isEmpty) return false
            if (this.chatUserParams.isLoading) return false
            if (this.chatUserParams.isNoMore) return false
            this.chatUserParams.isLoading = true
            Ajax({
                url: '/webapi/chat/firend',
                type: 'post',
                data: {
                    page, size 
                },
                success: (res) => {
                    if (res.code === 0) {
                        let data = res.data.data
                        let meta = res.data.meta.pagination
                        if (!meta.has_next) {
                            this.chatUserParams.isNoMore = true
                            if (meta.current_page === 1 && !data.length) {
                                this.chatUserParams.isEmpty = true
                                // return false
                            }
                        }
                        this.chatUserParams.page += 1
                        this.chatArrList = data.map(item => this.onFormatMsg(item))
                        if (meta.current_page === 1) {
                            if (this.productTheme) {
                                this.onSetChatProductUser(this.productTheme)
                            }
                        } else {
                            this.chatArrList = [...data, ...data]
                        }
                        const FRIENDID = 'friendId'
                        this.chatArrList = this.chatArrList.reduce((all, next) => all.some((atom) => atom[FRIENDID] == next[FRIENDID]) ? all : [...all, next],[])
                    } else {
                        this.$message.error(res.message)
                    }
                },
                complete: () => {
                    this.chatUserParams.isLoading = false
                }
            })
        },
        // 获取好友加载更多
        onGetMoreChatList (event) {
            if (onScrollView(event) === 'bottom') this.onGetChatList(this.chatUserParams)
        },
        // 切换当前聊天好友
        onGetChatDetails (item) {
            this.chatShowInfo = item
            this.onResetChatStatus()
            this.onGetHistoryChatMsg({ ...this.chatMsgParams, ...this.chatShowInfo })
        },
        // 当进来的路由带有聊天卡片消息时，需将当前聊天窗口置为聊天卡片本人
        onSetChatProductUser (item) {
            const isHas = this.chatArrList.find(nowDuc => nowDuc.friendId === ~~item.accept_user)
            if (isHas) {
                this.chatShowInfo = isHas
            } else {
                this.chatShowInfo = createMessage({
                    friendId: item.accept_user,
                    friendName: item.nickname || '',
                    friendUrl: item.avatar ||this.defaultAvatar,
                    myHeader: this.childUserInfo.avatar,
                    readTime: true,
                })
                this.chatArrList.unshift(this.chatShowInfo)
            }
            this.onResetChatStatus()
            this.onGetHistoryChatMsg({ ...this.chatMsgParams, ...{ friendId: item.accept_user } })
        },
        // 重置聊天列表状态
        onResetChatStatus () {
            this.chatMsgParams.isEmpty = false
            this.chatMsgParams.isLoading = false
            this.chatMsgParams.isNoMore = false
            this.chatMsgParams.page = 1
        },
        // 获取聊天历史消息
        onGetHistoryChatMsg ({ page, size, friendId: accept_user }) {
            if (this.chatMsgParams.isEmpty) return false
            if (this.chatMsgParams.isLoading) return false
            if (this.chatMsgParams.isNoMore) return false
            Ajax({
                url: '/webapi/chat/recode',
                type: 'post',
                data: {
                    page, size, accept_user
                },
                success: res => {
                    if (res.code === 0) {
                        let data = res.data.data
                        let meta = res.data.meta.pagination
                        if (!meta.has_next) {
                            this.chatMsgParams.isNoMore = true
                            if (meta.current_page === 1 && !data.length) {
                                this.chatMsgParams.isEmpty = true
                                return false
                            }
                        }
                        let id; // 这个Id是记录数据数据渲染到界面以后，需要滚动到那里去
                        this.chatMsgParams.page += 1
                        data = data.map(item => this.onFormatMsg(item))
                        id = data[data.length - 1].chatId
                        if (meta.current_page !== 1) {
                            id = this.chatItemList[0].chatId
                            data = [...data, ...this.chatItemList]
                        }
                        this.chatItemList = insertTimeItemToCurrentMessageList(data)
                        this.onMarkMsgRead(this.chatShowInfo)
                        this.onScrollToView(id)
                    } else {
                        this.$message.error(res.message)
                    }
                },
                complete: () => {
                    this.chatMsgParams.isLoading = false
                    this.$nextTick(() => {
                        // 输入框聚焦
                        this.$refs.chatInput.$refs.textareaBox.focus()
                    })
                }
            })
        },
        // 滚动获取更多历史信息
        onGetMoreChatItem (event) {
            if (onScrollView(event) === 'top') this.onGetHistoryChatMsg({ ...this.chatMsgParams, ...this.chatShowInfo })
        },
        // 格式化聊天消息
        onFormatMsg (item) {
            let oneMsg = {}
            const timer = Date.now()
            oneMsg = createMessage({
                type: item.son_type,
                chatId: item.chat_id,
                friendId: item.friend_info.user_id,
                friendName: item.friend_info.nickname || '',
                friendUrl: item.friend_info.avatar ||this.defaultAvatar,
                isMySelf: item.user === item.speak_user,
                myHeader: this.childUserInfo.avatar,
                isStatus: 1, // 发送成功
                readTime: item.user === item.speak_user ? timer : item.read_time, // 如果是自己发送出去的消息，则没有是否已读的说法了
                timestamp: item.send_time * 1000
            })
            if (item.son_type === 'NEWS') {
                oneMsg.content = JSON.parse(item.content)
            } else {
                oneMsg.content = item.content
            }
            return oneMsg
        },
        // 发送聊天消息
        onSendMsg (content, type) {
            let dataTime = Date.now()
            let param = {}
            let url = ''
            let paramsType = 'post'
            const { friendName, friendId, friendUrl } = this.chatShowInfo
            if (type === 'NEWS') {
                url = '/webapi/send/product'
                param = content
                paramsType = 'get'
            } else {
                url = '/webapi/chat'
                param = {
                    chat_type: type,
                    content,
                    accept_user: this.chatShowInfo.friendId
                }
            }
            let msg = createMessage({
                type,
                content,
                chatId: '',
                friendId,
                friendName,
                friendUrl,
                isMySelf: true,
                myHeader: this.childUserInfo.avatar,
                isStatus: 2, // 发送中
                readTime: dataTime,
                timestamp: dataTime
            })
            Ajax({
                url,
                data: param,
                type: paramsType,
                success: res => {
                    if (res.code === 0) {
                        if (type === 'NEWS') {
                            this.productTheme = null
                            window.history.replaceState({}, document.title, "/");
                        }
                        msg.chatId = res.data.data.id
                        msg.isStatus = 1 // 发送成功
                        this.chatItemList.push(msg)
                        this.chatItemList = insertTimeItemToCurrentMessageList(this.chatItemList)
                        this.onScrollToView(msg.chatId)
                        this.onSyncUserList(msg)
                    } else {
                        this.$message.error(res.message)
                    }
                }
            })
        },
        // 使聊天室滚动条滚动到指定位置
        onScrollToView (id) {
            this.$nextTick(() => {
                document.getElementById(`chat-item-${id}`).scrollIntoView()
            })
        },
        // 收到聊天消息
        onReceiveChat (msg) {
            // 如果当前窗口打开的就是发送过来的人
            // 就把消息也推送到聊天消息队列
            if (this.chatShowInfo && this.chatShowInfo.friendId === msg.friendId) {
                this.chatItemList.push(msg)
                this.onMarkMsgRead(this.chatShowInfo)
                this.onScrollToView(msg.chatId)
            }
            // 同步用户列表
            this.onSyncUserList(msg)
        },
        // 同步左侧用户列表聊天消息
        onSyncUserList (msg) {
            // 查找当前列表是否有这个用户
            // 有的话就删除再置顶
            let msgIndex = this.chatArrList.findIndex(item => {
                if (item.friendId === msg.friendId) {
                    item = msg
                    return true
                }
            })
            if (msgIndex !== -1) {
                this.chatArrList.splice(msgIndex, 1)
            }
            this.chatArrList.unshift(msg)
        },
        // 标记消息已读
        onMarkMsgRead ({ friendId }) {
            const record_id = this.chatItemList
                .map(item => {
                    if (!item.readTime) return item.chatId
                })
                .filter(item => item)
                .join(',')
            if (!record_id) return
            Ajax({
                url: '/webapi/read',
                data: {
                    record_id,
                    type: 'chat'
                },
                type: 'post',
                success: res => {
                    if (res.code === 0) {
                        // 消息置为已读
                        const time = Date.now()
                        this.chatItemList.map(item => item.readTime = time)
                        this.chatArrList.find(item => {
                            if (item.friendId === friendId) {
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

<style>

</style>