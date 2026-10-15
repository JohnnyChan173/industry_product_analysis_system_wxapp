/**
 * @description sms 短信接口
 */

import request from '../config/request.js'

const PREFIX = '/sms'

/**
 * 供应商手机号登录
 */
async function smsSupplierLogin(phone) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/supplierLogin`,
		data: {
			phone
		}
	})

	return info
}

export {
	smsSupplierLogin,
}
