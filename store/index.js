import Vue from "vue";
import Vuex from "vuex";
import {
	userCurrentInfo,
	userLogin,
	userLogout,
	userPhoneLogin
} from "../api/user.js";

import {
	toNumberFixed
} from "../utils/math.js";
import {
	getCurrentPageName
} from "../utils/native.js";
import storage from "../utils/storage.js";
import {
	errorToast
} from "../utils/toast.js";
import {
	StaffType
} from "../config/enums.js";
import {
	redirect2LoginPage
} from "../utils/checkLogin.js";
import {
	throwError,
	throwErrorWithToast
} from "../utils/index.js";
import {
	getListItemLabel,
	StaffTypeList
} from "../config/data.js";
import {
	lineGetManageLineId
} from "../api/line.js";

Vue.use(Vuex);

// mutations 原子操作命名
const SET_USER_INFO = 'SET_USER_INFO'
const SET_TENANT_INFO = 'SET_TENANT_INFO'
const SET_STAFF_INFO = 'SET_STAFF_INFO'
const SET_MANAGE_LINE_ID = 'SET_MANAGE_LINE_ID'

const getDefaultInfo = () => ({

})

const store = new Vuex.Store({
	state: {
		/** 用户信息 */
		userInfo: getDefaultInfo(),
		tenantInfo: getDefaultInfo(),
		staffInfo: getDefaultInfo(),

		/** 管理线体id */
		manageLineId: null
	},
	getters: {
		userInfo: (state) => state.userInfo,
		tenantInfo: (state) => state.tenantInfo,
		staffInfo: (state) => state.staffInfo,

		username: (state) => state.userInfo.username,
		userId: (state) => state.userInfo.userId,

		staffId: (state) => state.staffInfo.id,
		staffType: (state) => state.staffInfo.staffType,

		isMain: (state) => state.staffInfo.staffType === null,
		isXianZhang: (state) => state.staffInfo.staffType === StaffType.XIANZHANG,
		isPuGong: (state) => state.staffInfo.staffType === StaffType.PUGONG,
		isSpotCheck: (state) => state.staffInfo.staffType === StaffType.SPOTCHECK,
		isEvent: (state) => state.staffInfo.staffType === StaffType.EVENT,
		isWareHouse: (state) => state.staffInfo.staffType === StaffType.WAREHOUSE,

		staffTypeText: (state) => getListItemLabel(StaffTypeList, state.staffInfo.staffType),

		enterpriseId: (state) => state.userInfo.enterpriseId,
		enterpriseInfo: (state) => state.userInfo.enterpriseInfo,
		manageLineId: (state) => state.manageLineId
	},
	mutations: {
		[SET_USER_INFO](state, userInfo) {
			state.userInfo = userInfo
		},
		[SET_TENANT_INFO](state, tenantInfo) {
			state.tenantInfo = tenantInfo
		},
		[SET_STAFF_INFO](state, staffInfo) {
			state.staffInfo = staffInfo
		},
		[SET_MANAGE_LINE_ID](state, manageLineId) {
			state.manageLineId = manageLineId
		},
	},
	actions: {

		/** 登录 */
		async login({
			dispatch,
			commit,
		}, {
			account,
			password,
			phone,
			verifyCode
		}) {
			let token = ""

			if (account) {
				token = await userLogin(account, password)
			} else {
				token = await userPhoneLogin(phone, verifyCode)
			}

			// 存储 userToken
			storage.setToken(token)

			// 触发一次登录
			await dispatch("loginWithToken")
		},

		/** 通过 token 登录 */
		async loginWithToken({
			dispatch
		}) {
			// 通过本地 token 去获取用户信息
			try {
				const mainInfo = await userCurrentInfo()

				const {
					user: userInfo,
					tenantInfo,
					staffInfo
				} = mainInfo

				const {
					username,
				} = userInfo

				const {
					staffType,
				} = staffInfo

				if (staffType === StaffType.PUGONG) {
					throwErrorWithToast("普工 暂不允许登录")
					await dispatch("logout")
				} else if (staffType === StaffType.SPOTCHECK) {
					throwErrorWithToast("点检员 暂不允许登录")
					await dispatch("logout")
				} else if (staffType === StaffType.XIANZHANG) {
					// 获取线长管理线体id
					const manageLineId = await lineGetManageLineId()
					await dispatch("setManageLineId", manageLineId)
				}

				// 持久化最新账户
				await storage._set('account', username)

				// 持久化全部账户
				const accounts = await storage._get('accounts') || []

				// 存储至本地
				await storage._set('accounts', Array.from(new Set([
					...accounts,
					username
				])))

				// 同步 userInfo
				await dispatch("setUserInfo", userInfo)
				// 同步 tenantInfo
				await dispatch("setTenantInfo", tenantInfo)
				// 同步 staffInfo
				await dispatch("setStaffInfo", staffInfo)
			} catch (e) {
				console.log(e)

				errorToast(e.message)

				return Promise.reject(e)
			}
		},

		/** 退出登录 */
		async logout({
			dispatch
		}) {

			await userLogout()

			// 清理 token
			storage.removeToken()

			// 重置 数据
			await dispatch("setUserInfo", getDefaultInfo())
			await dispatch("setTenantInfo", getDefaultInfo())
			await dispatch("setStaffInfo", getDefaultInfo())
			await dispatch("setManageLineId", undefined)

			const currentPage = getCurrentPageName()
			// 如果非登录页就重定向登录页
			if (!(currentPage.includes("pages/login/index"))) {
				uni.redirectTo({
					url: "/pages/login/index"
				})
			}
		},

		setUserInfo({
			commit
		}, userInfo) {
			commit(SET_USER_INFO, userInfo)
		},

		setTenantInfo({
			commit
		}, tenantInfo) {
			commit(SET_TENANT_INFO, tenantInfo)
		},

		setStaffInfo({
			commit
		}, staffInfo) {
			commit(SET_STAFF_INFO, staffInfo)
		},

		setManageLineId({
			commit
		}, manageLineId) {
			commit(SET_MANAGE_LINE_ID, manageLineId)
		},

		clearAll({
			commit,
			state
		}) {
			state.userInfo = ""
			storage.clearAll()
		},

	}

});

export default store;