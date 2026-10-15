export function getCurrentPageName() {
	const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	return routes[routes.length - 1].route
}
