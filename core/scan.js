import {
	lineGetByUuid
} from "../api/line";
import {
	stationGetByUuid
} from "../api/station";
import {
	delay
} from "../utils";
import {
	errorToast
} from "../utils/toast"

const debug = false;

/** 扫描二维码-获取产线信息 */
export async function getLineInfoByScan() {

	// 测试用
	if (debug) {
		const lineUuid = "93f18515"

		const lineInfo = await lineGetByUuid(lineUuid)
		return lineInfo
	}

	await delay(500)

	// 真实用
	return new Promise((resolve, reject) => {
		uni.scanCode({
			onlyFromCamera: true,
			success: async function(res) {
				const lineUuid = res.result
				const lineInfo = await lineGetByUuid(lineUuid)
				resolve(lineInfo)
			}
		})
	})
}

/** 扫描二维码-获取工位信息 */
export async function getStationInfoByScan() {

	// 测试用
	if (debug) {
		const stationUuid = "22bf6051"
		const stationInfo = await stationGetByUuid(stationUuid)
		return stationInfo
	}

	await delay(500)

	// 真实用
	return new Promise((resolve, reject) => {
		uni.scanCode({
			onlyFromCamera: true,
			success: async function(res) {
				const stationUuid = res.result
				const stationInfo = await stationGetByUuid(stationUuid)

				if (stationInfo) {
					resolve(stationInfo)
				} else {
					errorToast("工位信息查询失败")
				}
			}
		})
	})
}

/** 获取值-通过扫描二维码 */
export function getValueByScanQrcode() {
	return getValueByScan(false, true)
}

/** 获取值-通过扫描一维码 */
export function getValueByScanBar() {
	return getValueByScan(true, false)
}

/** 获取值-通用扫码 */
export async function getValueByScan(barCode = true, qrCode = true) {
	await delay(500)
	// 测试用
	if (debug) {
		const result = "PT20240715172659"
		return result
	}

	return new Promise((resolve, reject) => {
		const canIUse = uni.canIUse("scanCode")
		if (!canIUse) {
			reject("非APP端")
			return
		}

		const scanType = []

		if (barCode) {
			scanType.push("barCode")
		}

		if (qrCode) {
			scanType.push("qrCode")
		}
		
		uni.scanCode({
			onlyFromCamera: true,
			scanType,
			success: (res) => {
				const {
					result
				} = res
				resolve(result)
			},
			fail(res) {
				reject(res)
			}
		})

	})
}