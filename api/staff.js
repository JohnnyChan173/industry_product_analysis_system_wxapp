/**
 * @description staff 工位接口
 */

import {
	defaultMaxPageSize,
	defaultSort
} from '../config/index.js'
import request from '../config/request.js'

const PREFIX = '/staff'

/**
 * 获取员工分页列表
 */
async function staffList({
	pageNum,
	pageSize,
	sort,
	staffType,
	keyword = "",
}) {
	const data = {
		pageNum,
		pageSize,
		sort,
		staffType,
		keyword,
	}

	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/list`,
		data
	})

	return rs
}

/**
 * 获取全部员工列表
 */
async function staffListAll({
	staffType,
	staffSignStatus
}) {
	const data = {
		pageNum: 1,
		pageSize: defaultMaxPageSize,
		sort: defaultSort,
		staffType,
		staffSignStatus
	}
	console.log(staffType)
	const {
		records
	} = await staffList(data)

	return records
}

export {
	staffListAll,
}