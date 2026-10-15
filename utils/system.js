/** 异步更新结束 */
export function instanceNextTick() {
	return new Promise((resolve) => {
		this.$nextTick(() => {
			resolve()
		})
	})
}