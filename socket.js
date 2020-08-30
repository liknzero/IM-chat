let Socket = ''
let setIntervalWesocketPush = null
let socketUrl = ''
let socketUserInfo = null
const DEFAULT_AVATAR = '/pc-images/default-avatar.png'
const SYSTEM_AVATAR = '/pc-images/icon-system-avatar.png'
/**
 * 建立websocket连接
 * @param {string} url ws地址
 * @param {number} userId 用户id
 */
export const createSocket = (url, userInfo) => {
    socketUrl = url
    socketUserInfo = userInfo
    Socket && Socket.close()
    if (!Socket) {
        console.log('建立websocket连接')
        Socket = new WebSocket(url)
        Socket.onopen = onopenWS(socketUserInfo.user_id)
        Socket.onmessage = onmessageWS
        Socket.onerror = onerrorWS
        Socket.onclose = oncloseWS
    } else {
        console.log('websocket已连接')
    }
}

/**打开WS之后发送心跳 */
const onopenWS = (userId) => {
    return () => {
        sendWSPush({
            type: 'chat',
            msg: 'init',
            user_id: userId
        })
        sendPing()
    }
}

/**连接失败重连 */
const onerrorWS = () => {
  Socket.close()
  clearInterval(setIntervalWesocketPush)
  console.log('连接失败重连中')
  if (Socket.readyState !== 3) {
    Socket = null
    createSocket(socketUrl, socketUserInfo)
  }
}

/**WS数据接收统一处理 */
const onmessageWS = e => {
    console.log('onmessageWS', JSON.parse(e.data))
    const data = JSON.parse(e.data)
    if (data.code === 0) {
        let dataMsg = data.data.info
        let msg = null
        if (data.data.type === 'chat') {
            // 私信消息
            msg = createMessage({
                type: dataMsg.son_type,
                chatId: dataMsg.chat_id,
                friendId: dataMsg.friend,
                friendName: dataMsg.friend_info.nickname || '',
                friendUrl: dataMsg.friend_info.avatar || DEFAULT_AVATAR,
                myHeader: '',
                isMySelf: dataMsg.speak_user === socketUserInfo.user_id,
                isStatus: 1, // 成功
                readTime: dataMsg.read_time,
                timestamp: dataMsg.send_time * 1000
            })
            if (dataMsg.son_type === 'NEWS') {
                msg.content = JSON.parse(dataMsg.content)
            } else {
                msg.content = dataMsg.content
            }
        } else if (data.data.type === 'system') {
            msg = createSystemMessage({
                systemId: dataMsg.sys_mesg_id,
                title: dataMsg.title,
                content: dataMsg.content,
                readTime: dataMsg.read_time,
                timestamp: dataMsg.created_at * 1000
            })
        } else {
            return false
        }
        window.dispatchEvent(new CustomEvent('onmessageWS', {
            detail: msg
        }))
    } else if (data.code === 401) {
        // 链接有误，等待下一步处理
    }
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = message => {
  setTimeout(() => {
    if (Socket.readyState === 0) {
      connecting(message)
    } else {
      Socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = message => {
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close()
    createSocket(socketUrl, socketUserInfo)
  } else if (Socket.readyState === 1) {
      console.log(JSON.stringify(message))
    Socket.send(JSON.stringify(message))
  } else if (Socket.readyState === 0) {
    connecting(message)
  }
}

/**断开重连 */
const oncloseWS = () => {
  clearInterval(setIntervalWesocketPush)
  console.log('websocket已断开....正在尝试重连')
  if (Socket.readyState !== 2) {
    Socket = null
    createSocket(socketUrl, socketUserInfo)
  }
}
/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing = (time = 5000, ping = 'ping') => {
  clearInterval(setIntervalWesocketPush)
  const content = JSON.stringify({ type: ping })
  Socket.send(content)
  setIntervalWesocketPush = setInterval(() => {
    Socket.send(content)
  }, time)
}


/*
  * 这里统一处理消息格式
  * @type: 消息类型， TEXT 文本， IMAGE 图片
  *
  * */
export const createMessage = ({type, content, chatId, friendId, isMySelf, isStatus, readTime, timestamp, friendUrl, friendName, myHeader}) => {
    return {
      class: 'chat', // 大类，聊天消息
      friendId: ~~friendId, // 用于区分收到的消息分发给哪个房间
      friendUrl, // 用户头像
      friendName, // 用户昵称
      chatId: ~~chatId, // 消息id
      type, // 类型： text 文本， image 图片
      isStatus, // 发送状态 0 失败，1 成功, 2 发送中
      readTime, // 是否已读 // 为null则未读 有值则已读
      timestamp, // 时间戳，排序用
      isMySelf, // 是否为我自己发送的消息
      myHeader, // 自己的头像
      content // 发送消息主体， 根据type显示不同消息类型
    }
  }
  /*
  * 这里是系统消息的统一格式
  * */
export const createSystemMessage = ({ systemId, title, readTime, timestamp, content }) => {
    return {
      class: 'system', // 大类，系统消息
      systemId: ~~systemId, // 系统消息id
      systemAvatar: SYSTEM_AVATAR, // 系统头像
      title, // 系统标题
      readTime, // 已读时间，未读则为null
      content,
      timestamp, // 时间戳，排序用
    }
  }
