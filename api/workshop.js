/**
 * @description workshop 车间接口
 */

import request from '../config/request.js'

const PREFIX = '/workshop'

/**
 * 获取车间分页列表
 */
async function workshopList({
	pageNo,
	pageSize,
	sort,
}) {
	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/list`,
		data: {
			pageNo,
			pageSize,
			sort,
		}
	})

	return rs
}

export {
	workshopList,
}
