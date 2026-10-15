class MyStorage {
	constructor() {}

	_remove(key) {
		uni.removeStorageSync(key)
	}

	_set(key, data) {

		if (typeof data === undefined || data === null) {
			data = ''
		} else if (typeof data === 'object') {
			// 数组或对象 序列号
			try {
				data = JSON.stringify(data)
			} catch (e) {
				console.log(e)
			}
		}

		return uni.setStorageSync(key, data)
	}

	_get(key) {
		let data = uni.getStorageSync(key)
		// console.log(key,data)
		try {
			data = JSON.parse(data)
		} catch (e) {
			// console.log(e)
		}
		return data
	}

	/** 设置凭证 */
	setToken(data) {
		return this._set('token', data)
	}
	
	/** 获取凭证 */
	getToken() {
		return this._get('token')
	}
	
	/** 删除凭证 */
	removeToken() {
		return this._remove('token')
	}

	clearAll() {
		uni.clearStorageSync();
	}

}

export default new MyStorage()
