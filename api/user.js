/**
 * @description user 用户接口
 */

import request from '../config/request.js'

const PREFIX = '/sys'

/**
 * 用户名登录
 */
async function userLogin(username, password) {
	const token = await request({
		method: 'POST',
		url: `${PREFIX}/login`,
		data: {
			username,
			password
		}
	})

	return token
}

/**
 * 用户名登出
 */
async function userLogout() {
	const data = await request({
		method: 'POST',
		url: `${PREFIX}/logout`,
	})

	return data
}

/**
 * 手机号登录
 */
async function userPhoneLogin(phone, verifyCode) {
	const token = await request({
		method: 'POST',
		url: `${PREFIX}/phoneLogin`,
		data: {
			phone,
			verifyCode
		}
	})

	return token
}

/**
 * 获取当前用户信息
 */
async function userCurrentInfo() {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/currentInfo`,
	})

	return info
}

export {
	userLogin,
	userLogout,
	userPhoneLogin,
	userCurrentInfo
}