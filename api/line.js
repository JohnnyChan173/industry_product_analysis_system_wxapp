/**
 * @description line 线体接口
 */

import request from '../config/request.js'

const PREFIX = '/line'

/**
 * 产线-详情
 */
async function lineDetail(lineId) {
	const rs = await request({
		method: 'GET',
		url: `${PREFIX}`,
		data: {
			id:lineId,
		}
	})

	return rs
}

/**
 * 产线-详情-通过uuid
 */
async function lineGetByUuid(uuid) {
	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/getByUuid`,
		data: {
			uuid,
		}
	})

	return rs
}

/**
 * 获取线体分页列表
 */
async function lineList({
	pageNum,
	pageSize,
	sort,
	keyword,
	workshopId,
}) {
	const data = {
		pageNo,
		pageSize,
		sort,
		keyword,
		workshopId,
	}

	if (!sort) {
		delete data.sort
	}
	if (!keyword) {
		delete data.keyword
	}
	if (!workshopId) {
		delete data.workshopId
	}


	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/list`,
		data
	})

	return rs
}

/**
 * 获取线体下的物料列表
 */
async function lineMaterialList({
	pageNo,
	pageSize,
	sort,
	keyword,
	lineId
}) {
	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/materialList`,
		data: {
			pageNo,
			pageSize,
			sort,
			keyword,
			lineId,
		}
	})

	return rs
}

/**
 * 获取线体详情【通过二维码】
 */
async function lineGetInfoByQrcode(qrcode) {
	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/lineQrcode`,
		data: {
			qrcode
		},
	})

	return rs
}

/**
 * 添加今日产品型号
 */
async function lineAddProduct(lineId, productModel, date = "") {
	const rs = await request({
		method: 'POST',
		url: `${PREFIX}/addProduct`,
		data: {
			lineId,
			productModel,
			date
		},
	})

	return rs
}

/**
 * 添加产品型号
 */
async function lineUpdateProduct(id, productModel, date = "") {
	const rs = await request({
		method: 'PUT',
		url: `${PREFIX}/updateProduct`,
		data: {
			id,
			productModel,
			date
		},
	})

	return rs
}

/**
 * 线体-产品型号登记列表
 */
async function lineProductRecordList(lineId, keyword = "") {
	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/productRecordList`,
		data: {
			lineId,
			keyword
		},
	})

	return rs
}


/**
 * 产线-获取管理线体id
 */
async function lineGetManageLineId() {
	const rs = await request({
		method: 'GET',
		url: `${PREFIX}/getManageLineId`,
	})

	return rs
}

export {
	lineDetail,
	lineGetByUuid,
	
	lineList,
	lineMaterialList,
	lineGetInfoByQrcode,
	lineAddProduct,
	lineUpdateProduct,
	lineProductRecordList,
	lineGetManageLineId
}