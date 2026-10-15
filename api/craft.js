/**
 * @description craft 工艺接口
 */

import request from '../config/request.js'

const PREFIX = '/craft'

/**
 * 工艺-获取列表-通过产线id
 */
async function craftListByLineId(lineId) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/listByLineId`,
		data: {
			lineId
		}
	})

	return info
}


export {
	craftListByLineId,
}