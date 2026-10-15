/**
 * @description virtualLine 虚拟产线接口
 */

import request from '../config/request.js'

const PREFIX = '/virtualLine'

/**
 * 虚拟产线-列表-通过线体id
 */
async function virtualLineListByLineId(lineId) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/listByLineId`,
		data: {
			lineId
		}
	})

	return info
}

/**
 * 虚拟产线-通过生产参数获取详情
 */
async function virtualLineGetByProductParam(lineId, productId) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/getByProductParam`,
		data: {
			lineId,
			productId
		}
	})

	return info
}


export {
	virtualLineListByLineId,
	virtualLineGetByProductParam
}