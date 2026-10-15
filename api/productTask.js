/**
 * @description productTask 登记接口
 */

import request from '../config/request.js'

const PREFIX = '/productTask'


/**
 * 生产任务单-详情
 */
async function productTaskDetail(id) {
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
 * 生产任务单-分页列表
 */
async function productTaskList(data) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/list`,
		data
	})

	return info
}

/**
 * 生产任务单-通过任务单编号获取详情
 */
async function productTaskGetByTaskNo(taskNo) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/getByTaskNo`,
		data: {
			taskNo
		}
	})

	return info
}


export {
	productTaskList,
	productTaskDetail,
	productTaskGetByTaskNo
}
