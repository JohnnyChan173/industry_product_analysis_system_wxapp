import Vue from "vue"
import {
	delay
} from "."
import {
	getCurrentPageName
} from "./native"
import store from "../store/index.js"

export async function checkLogin() {

	uni.showLoading({
		title: "检测登录状态..."
	})

	try {
		// 检测一次登录
		await Vue.prototype.$store.dispatch("loginWithToken")
		// 正常
		const currentPage = getCurrentPageName()
		console.log(currentPage)
		// 如果是登录页就重定向至主页
		if (currentPage.includes("pages/login/index")) {
			uni.redirectTo({
				url: "/pages/home/index"
			})
		}

	} catch (err) {
		await store.dispatch("logout")
	} finally {
		uni.hideLoading()
	}

}


