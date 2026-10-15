import {
	throwError
} from './index.js'

export function str2U8(str) {
	// 'abcd'=> 2个一组 16*10+11 
	const hexStr = string2HexString(str)
	let buffer = new ArrayBuffer(parseInt(hexStr.length / 2))
	let dataView = new DataView(buffer)

	for (let i = 0; i < hexStr.length; i += 2) {
		const s1 = hexStr[i]
		const s2 = hexStr[i + 1]
		const s = s1 + s2
		const hexVal = parseInt(s, 16)
		dataView.setUint8(i / 2, hexVal)
	}
	var u8 = new Uint8Array(buffer)

	return u8
}

function string2HexString(str) {

	let hexString = ''
	for (let i = 0; i < str.length; i++) {
		// console.log(str[i].charCodeAt(), str[i].charCodeAt().toString(16))
		const hexStr = str[i].charCodeAt().toString(16)
		// 00ab => ab,009 => 09
		hexString += ('00' + hexStr).slice(-2);
	}

	return hexString
}

/**
 * 计算数组稳态对
 * @param arr 数组值 [100,101,0,99,100,99.5]
 * @param offset 稳态偏移量 1
 * @param leastCount 至少点数 3
 * @returns [[3,5]]
 */
export function findAverageWithOffset(arr, offset, leastCount = 3) {

	const findIndexArr = []

	let startIndex = null
	for (let i = 0; i < arr.length; i++) {

		// 有始点，则判断是否为终点
		if (startIndex !== null) {
			const a = arr[startIndex]
			const b = arr[i]
			// 前后相差大于偏差，b 为终点
			if (Math.abs(b - a) > offset) {

				// 且满足最低点数
				if (i - startIndex >= leastCount) {
					// 保存
					findIndexArr.push([startIndex, i - 1])
				}

				startIndex = null
				// i 从终点开始
				i--
				continue

			}

			// 有始点，且到边界，且满足最低点位
			if (i === arr.length - 1 && i - startIndex >= leastCount) {
				// 保存
				findIndexArr.push([startIndex, i])
			}

		} else {
			// 到边界直接退出
			if (i === arr.length - 1) {
				break;
			}

			// 没有始点，判断始点
			const a = arr[i]
			const b = arr[i + 1]
			// 前后相差小于等于偏差，i 为始点
			if (Math.abs(b - a) <= offset) {
				startIndex = i
			} else {
				startIndex = null
			}
		}
	}
	return findIndexArr
}

export function toNumberFixed(num, fix = 0) {
	const digit = parseFloat(Number(num).toFixed(fix))
	// if (!digit && digit !== 0) {
	// 	throwError("toNumberFixed error")
	// }
	return digit
}
