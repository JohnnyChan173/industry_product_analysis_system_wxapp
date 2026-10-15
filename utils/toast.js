/** 简单提示框 */
export function simpleToast(title, opts = {}) {
	const options = {
		icon: "none",
		...opts
	}

	uni.showToast({
		...options,
		title
	})
}

/** 错误提示框 */
export function infoToast(title) {
	title = "! " + title

	console.log(title)

	simpleToast(title, {
		icon: "none",
		duration: 3000
	})
}

/** 错误提示框 */
export function errorToast(title) {
	title = "× " + title

	console.log(title)

	simpleToast(title, {
		icon: "none",
		duration: 3000
	})
}

/** 成功提示框 */
export function successToast(title, big = false) {
	title = "√ " + title

	console.log(title)

	simpleToast(title, {
		icon: big ? "success" : "none",
		duration: 1500,
	})
}

/** promise 拒绝方法，带提示 */
export function reject2Toast(reject, rejectMsg) {
	// 先触发 reject
	reject(rejectMsg)

	// 再强制唤起Toast
	simpleToast(rejectMsg)
}