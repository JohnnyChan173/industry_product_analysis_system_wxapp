/**
 * @description  request 全局https?请求
 */

import Vue from 'vue'
import storage from '@/utils/storage';
import {
	errorToast
} from '@/utils/toast.js'
import {
	requestTimeout
} from '.';
import {
	purifyObject
} from '../utils';
import store from "../store/index.js"

export const env = {
	baseUrl: "",
	baseUploadUrl: "",
	ossUniversalUrl: "",
}

// 开发模式
if (process.env.NODE_ENV === 'development') {

	// 线上接口域名版(用于体验版线上接口测试)
	// env.baseUrl = "https://efficiency.nbkxpt.com:8125/api"
	// env.baseUploadUrl =
	// 	"https://efficiency.nbkxpt.com:8125/api/file/upload"
	// env.ossUniversalUrl =
	// 	"https://nbkxpt-source-bucket.oss-cn-hangzhou.aliyuncs.com/production_efficiency_analysis/universal/"

	// mock 接口
	env.baseUrl = "https://console-mock.apipost.cn/app/mock/project/645e8241-a72b-4015-bde3-9225416d5d05"
	env.baseUploadUrl =
		"https://console-mock.apipost.cn/app/mock/project/645e8241-a72b-4015-bde3-9225416d5d05/file/upload"
	env.ossUniversalUrl =
		"https://nbkxpt-source-bucket.oss-cn-hangzhou.aliyuncs.com/industry_product_analysis/universal/"


	// 本地测试 杨豪接口
	env.baseUrl = "http://192.168.100.201:8888/api"
	env.baseUploadUrl =
		"http://192.168.100.201:8888/api/file/upload"
	env.ossUniversalUrl =
		"https://weishi-dev-project-bucket.oss-cn-hangzhou.aliyuncs.com/industry_product_analysis/universal/"

	// 线上接口
	// env.baseUrl = "https://gyscfx.wskxpt.cn:8153/api"
	// env.baseUploadUrl =
	// 	"https://gyscfx.wskxpt.cn:8153/api/file/upload"
	// env.ossUniversalUrl =
	// 	"https://nbkxpt-source-bucket.oss-cn-hangzhou.aliyuncs.com/industry_product_analysis/universal/"

} else {
	// 线上接口
	env.baseUrl = "https://gyscfx.wskxpt.cn:8153/api"
	env.baseUploadUrl =
		"https://gyscfx.wskxpt.cn:8153/api/file/upload"
	env.ossUniversalUrl =
		"https://nbkxpt-source-bucket.oss-cn-hangzhou.aliyuncs.com/industry_product_analysis/universal/"

}

export const AUTHORIZATION_HEADER = "Authorization";

/**
 * 标准请求
 * @param {object} param0 { method,url,data }
 */
function request({
	apiUrl = env.baseUrl,
	method = 'GET',
	url = '',
	data = {},
}) {
	// 格式化 data

	const rs = new Promise((resolve, reject) => {
		const authorizationHeader = "Bearer " + storage.getToken()

		// 判断是对象才净化
		if (typeof data === 'object' && !Array.isArray(data)) {
			data = purifyObject(data)
		}

		uni.request({
			timeout: requestTimeout,
			header: {
				[AUTHORIZATION_HEADER]: authorizationHeader
			},
			method,
			url: apiUrl + url,
			data,
			success: (res) => {
				const resData = res.data
				const {
					code,
					data,
					message
				} = resData
				if (code === 200) {
					resolve(data)
				} else if (code === 401) {
					store.dispatch("logout")
					reject(message)
				} else {
					reject(message)
					errorToast(message)
				}
			},
			fail: (res) => {
				const msg = res.errMsg
				reject(msg)
				errorToast(msg)
			}
		});
	})
	return rs
}

export {
	request as
	default,
}