/**
 * @description registration 登记接口
 */

import request from '../config/request.js'

const PREFIX = '/registration'

/**
 * 生产登记-删除
 */
async function registrationDel(id) {
	const info = await request({
		method: 'DELETE',
		url: `${PREFIX}?id=${id}`,
		// data: {
		// 	id
		// }
	})

	return info
}

/**
 * 生产登记-结束
 */
async function registrationEnd(id, actualProductNumber) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/end`,
		data: {
			id,
			actualProductNumber
		}
	})

	return info
}

/**
 * 生产登记-开始
 */
async function registrationStart(id) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/start`,
		data: {
			id
		}
	})

	return info
}

/**
 * 生产登记-员工考勤
 */
async function registrationStaffSign(data) {
	console.log(data)
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/staffSign`,
		data
	})

	return info
}

/**
 * 生产登记-创建
 */
async function registrationAdd(data) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}`,
		data
	})

	return info
}

/**
 * 生产登记-详情
 */
async function registrationDetail(id) {
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
 * 生产登记-详情-最新
 */
async function registrationGetByLatest(lineId) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/getByLatest`,
		data: {
			lineId
		}
	})

	return info
}

/**
 * 生产登记-分页列表
 */
async function registrationList(data) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/list`,
		data
	})

	return info
}


// -----------------------
/**
 * 工位登记-最新数据
 */
async function registrationLatest() {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/latest`
	})

	return info
}


/**
 * 工位登记-最新数据（通过uuid）
 */
async function registrationLatestByStationUuid(stationUuid) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/latestByStationUuid`,
		data: {
			stationUuid
		}
	})

	return info
}

/**
 * 工位登记-员工开始工作
 */
async function registrationStaffStart(stationId) {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/staffStart`,
		data: {
			stationId
		}
	})

	return info
}

/**
 * 工位登记-员工结束工作
 */
async function registrationStaffEnd() {
	const info = await request({
		method: 'POST',
		url: `${PREFIX}/staffEnd`
	})

	return info
}

/**
 * 工位登记-指定时段登记数据
 */
async function registrationSpecifyDateData(data) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/specifyDateData`,
		data
	})

	return info
}

/**
 * 生产登记-最新节拍生产数量
 */
async function registrationLatestBeatProductNumber(id) {
	const info = await request({
		method: 'GET',
		url: `${PREFIX}/latestBeatProductNumber`,
		data: {
			id
		}
	})

	return info
}


export {
	registrationLatest,
	registrationLatestByStationUuid,
	registrationStaffStart,
	registrationStaffEnd,
	registrationSpecifyDateData,

	registrationList,
	registrationDetail,
	registrationAdd,
	registrationStaffSign,
	registrationGetByLatest,
	registrationStart,
	registrationEnd,
	registrationDel,
	registrationLatestBeatProductNumber
}