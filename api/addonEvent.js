/**
 * @description addonEvent  安灯事件接口
 */

import request from '../config/request.js'

const PREFIX = '/addonEvent'

/**
 * 安灯事件-处理
 */
async function addonEventHandle(data) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/handle`,
		data
	})

	return info
}

/**
 * 安灯事件-无效事件
 */
async function addonEventInvalid(id) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/invalid`,
		data: {
			id
		}
	})

	return info
}

/**
 * 安灯事件-详情
 */
async function addonEventDetail(id) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}`,
		data: {
			id
		}
	})

	return info
}

/**
 * 安灯事件-分页列表
 */
async function addonEventList(data) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/list`,
		data
	})

	return info
}

export {
	addonEventList,
	addonEventDetail,
	addonEventHandle,
	addonEventInvalid,
}