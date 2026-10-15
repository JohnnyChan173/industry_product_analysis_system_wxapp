import toast, {
	errorToast
} from './toast.js'

/**
 * @param {Object|String} err 
 */
export function throwError(err) {
	console.error(err)
	if (typeof err === 'object') {
		err = JSON.stringify(err)
	}
	err = JSON.stringify(err)
	throw new Error(err)
}

/**
 * @param {Object|String} err 
 */
export function throwErrorWithToast(err) {
	console.error(err)
	if (typeof err === 'object') {
		err = JSON.stringify(err)
	}
	errorToast(err)
	throw new Error(err)
}

export function delay(time = 1000) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, time)
	})
}

export function isJson(str) {
	let obj
	try {
		obj = JSON.parse(str)
	} catch (e) {
		// console.log(e)
		return false
	}
	return obj
}

export function isEmpty(v) {
	if (v === null || v === undefined || v === '') {
		return true
	}

	if (Array.isArray(v)) {
		return v.length === 0
	}
	return false
}

/**
 * 时间格式化 返回 yyyy-mm-dd hh:mm:ss
 * @param {number} timestamp 时间戳
 */
export function formatTime(date = Date.now(), fmt = "yyyy-MM-dd hh:mm:ss") { //date可以是时间对象，或者时间格式字符串
	date = new Date(date);
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
			"00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * 计算时间的剩余时长
 * @param {string} date1 日期1
 * @param {string} date2 日期2
 */
export function calcDateRestTime(date1, date2, mode = "m") {
	const d1 = new Date(date1)
	const d2 = new Date(date2)

	const t1 = d1.getTime()
	const t2 = d2.getTime()
	const v = t1 - t2
	if (mode === "m") {
		return v / 1000 / 60 | 0
	} else {
		return v
	}

}

/**
 * 获取随机ID
 * @param {number} len ID长度 <= 10
 */
export function randomId(len = 10) {
	return Math.random()
		.toString(32)
		.slice(2, len + 2)
}

/**
 * 获取随机数据
 * @param {array} list 原数组
 * @param {number} num 随机数据的个数
 * @return {array}
 */
export function getRandomDataInList(list, num = 1) {
	const copyList = [...list]
	const randomList = []

	while (num) {
		const randomIndex = Math.floor((copyList.length) * Math.random())
		randomList.push(copyList[randomIndex])
		copyList.splice(randomIndex, 1)
		num--
	}

	return randomList
}

/**
 * 防抖
 * @param {function} fn 
 * @param {function} delay
 */
export function debounce(fn, delay) {
	var timer = null;
	return function() {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(this, arguments)
		}, delay);
	}
}

/** 生成 query 字符参数 */
export function genQuery(query) {
	return Object.entries(query).map(([k, v]) => `${k}=${v}`).join('&')
}


/** 补齐选择项头部 */
export function unshiftSelectItem(list, {
	label,
	value
}) {
	const l = list.slice()
	l.unshift({
		label,
		value
	})
	return l
}

/** 净化对象-去除空值 */
export function purifyObject(obj) {
	const o = Object.assign({}, obj)
	for (let key in o) {
		const v = o[key]
		if (v === null || v === undefined) {
			delete o[key]
		}
	}

	return o
}