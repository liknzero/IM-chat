const DATE = new Date();
const YEAR = DATE.getFullYear();
const MONTH = DATE.getMonth() + 1;
const DAY = DATE.getDate();

/**
 * 返回年月日
 * @export
 * @param {Date} date
 * @param {string} [splitor='-']
 * @returns
 */
export function getDate(date, splitor = '-', isNeedYear = true) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return isNeedYear ? `${year}${splitor}${addZeroPrefix(month)}${splitor}${addZeroPrefix(day)}` : `${addZeroPrefix(month)}${splitor}${addZeroPrefix(day)}`;
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

export function getFullDate(date, isNeedYear) {
    return `${getDate(date, '-', isNeedYear)} ${getTime(date)}`;
}

export function isToday(date) {
    return date.toDateString() === DATE.toDateString();
}

export function isMonth(date) {
    return MONTH === new Date(date).getMonth() + 1;
}

export function isYesterday(time) {
    const today = `${YEAR}/${MONTH}/${DAY}`;
    const todayTime = new Date(today).getTime(); // 当天凌晨的时间
    const yesterdayTime = new Date(todayTime - 24 * 60 * 60 * 1000).getTime(); // 昨天凌晨的时间
    return time < todayTime && yesterdayTime <= time;
}

/** 
 * @export
 * @param {number} time: 时间戳（根据后台返回的时间戳做处理）
 * 
*/
export function calculateTime(theTime) {
    let time = theTime * 1000
    if (isToday(new Date(time))) {
        return getTime(new Date(time));
    } else if (isYesterday(time)) {
        return '昨天  ' + getTime(new Date(time));
    } else if (isMonth(time)) {
        return getFullDate(new Date(time), false)
    } else {
        return getFullDate(new Date(time));
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
