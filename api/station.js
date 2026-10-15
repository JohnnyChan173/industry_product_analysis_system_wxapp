/**
 * @description station 工位接口
 */

import {
	defaultMaxPageSize
} from '../config/index.js'
import request from '../config/request.js'

const PREFIX = '/station'

/**
 * 获取当前工位信息
 */
async function stationDetail(id) {
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
 * 获取当前工位信息（通过uuid）
 */
async function stationGetByUuid(stationUuid) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/getByStationUuid`,
		data: {
			stationUuid
		}
	})

	return info
}

/**
 * 工位-绑定模组UUID
 */
async function stationBindModuleUuid(id, moduleUuid) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/bindModuleUuid`,
		data: {
			id,
			moduleUuid
		}
	})

	return info
}

/**
 * 工位-解绑模组UUID
 */
async function stationUnbindModuleUuid(id) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/unbindModuleUuid`,
		data: {
			id,
		}
	})

	return info
}

/**
 * 工位-设置具备模块
 */
async function stationSetEnablePart(data) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/setEnablePart`,
		data
	})

	return info
}

/**
 * 获取工位分页列表
 */
async function stationList({
	pageNum,
	pageSize,
	sort,
	keyword,
	lineId,
}) {
	const data = {
		pageNum,
		pageSize,
		sort,
		keyword,
		lineId,
	}

	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/list`,
		data
	})

	return rs
}

/** 获取全部工位 */
async function stationListAll(lineId) {
	const {
		records
	} = await stationList({
		pageNum: 1,
		pageSize: defaultMaxPageSize,
		lineId,
		sort: "station_sort asc"
	})

	return records
}

export {
	stationDetail,
	stationGetByUuid,
	stationBindModuleUuid,
	stationUnbindModuleUuid,
	stationSetEnablePart,
	stationListAll
}