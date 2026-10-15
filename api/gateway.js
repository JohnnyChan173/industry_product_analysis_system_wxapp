/**
 * @description gateway 工位接口
 */

import {
	defaultMaxPageSize
} from '../config/index.js'
import request from '../config/request.js'

const PREFIX = '/gateway'

/**
 * 网关-绑定模组
 */
async function gatewayBindModule(data) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/bindModule`,
		data
	})

	return info
}

export {
	gatewayBindModule,
}