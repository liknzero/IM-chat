/**
 * 返回年月日
 * @export
 * @param {Date} date
 * @param {string} [splitor='-']
 * @returns
 */
export function getDate(date, splitor = '-') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}${splitor}${addZeroPrefix(month)}${splitor}${addZeroPrefix(day)}`;
}

/**
 * 返回时分秒/时分
 * @export
 * @param {*} date
 * @param {boolean} [withSecond=false]
 * @returns
 */
export function getTime(date, withSecond = false) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return withSecond ? `${addZeroPrefix(hour)}:${addZeroPrefix(minute)}:${addZeroPrefix(second)}` : `${hour}:${addZeroPrefix(minute)}`;
}

export function getFullDate(date) {
    return `${getDate(date)} ${getTime(date)}`;
}

export function isToday(date) {
    return date.toDateString() === new Date().toDateString();
}

export function isYesterday(time) { // !注意这里传入time，我懒得统一格式。。。
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${year}/${month}/${day}`;
    const todayTime = new Date(today).getTime(); // 当天凌晨的时间
    const yesterdayTime = new Date(todayTime - 24 * 60 * 60 * 1000).getTime(); // 昨天凌晨的时间
    return time < todayTime && yesterdayTime <= time;
}

/** 
 * @export
 * @param {number} time: 时间戳（根据后台返回的时间戳做处理）
 * 
*/
export function calculateTime(time) {
    if (isToday(new Date(time * 1000))) {
        return getTime(new Date(time * 1000));
    } else if (isYesterday(time * 1000)) {
        return '昨天  ' + getTime(new Date(time * 1000));
    } else {
        return getFullDate(new Date(time * 1000)); 
    }
}

/**
 * 个位数，加0前缀
 * @param {*} number
 * @returns
 */
function addZeroPrefix(number) {
    return number < 10 ? `0${number}` : number;
}

/**
 * @param {Array} currentMessageList: 需要被格式化的数组
*/
// 格式化列表时间
export function insertTimeItemToCurrentMessageList (currentMessageList) {
    let compareTime
    currentMessageList.map((item) => {
        if (!compareTime) {
            //! compareTime不存在  是第一条数据 必须显示时间
            compareTime = item.timestamp
            item.isShowTime = true
        } else {
            // 第二条数据以后
            // !跟compareTime相差5分钟以内
            if (Math.abs(compareTime - item.timestamp) < 300000) {
                // 不用显示时间
                item.isShowTime = false
            } else {
                item.isShowTime = true
                // !compareTime 重置
                compareTime = item.timestamp
            }
        }
    })
    return currentMessageList
}
export function inset111 (currentMessageList) {
    let compareTime
    let newMessageList = [] // !待插入
    let originMessageList = [...currentMessageList].filter(item => !item.msgType) // 清除时间列
    originMessageList.map((item, index) => {
        if (!compareTime) { //! compareTime不存在  是第一条数据
            compareTime = item.timestamp
        } else { // !第二条数据后
            if (Math.abs(compareTime - item.timestamp) < 300) { // !跟compareTime相差5分钟以内
                // !不用做
            } else {
                newMessageList.push({
                    msgType: 'addTime',
                    timestamp: originMessageList[index - 1].timestamp // !找到上一项的时间，这个才是5分钟内最早的时间
                });
                compareTime = item.timestamp // !compareTime 重置
            }
        }
        newMessageList.push(item)
        if (index === originMessageList.length - 1) { // !如果是最后的数据
            newMessageList.push({
                msgType: 'addTime',
                timestamp: item.timestamp
            })
        }
    })
    console.log(newMessageList)
    return newMessageList
}
