/** 状态栏 */
export const navStatusBarHeight = uni.getSystemInfoSync().statusBarHeight

/** 系统信息 */
export const systemInfo = uni.getSystemInfoSync()
console.log(systemInfo)

/** 底部安全距离 */
const bottomSafeHeight = systemInfo.safeArea.bottom - systemInfo.safeArea.height

/** 标题栏 */
// export const navTitleBarHeight = 42
export const navTitleBarHeight = 45

/** 顶部导航高度： 即状态栏 + 标题栏 */
export const navBarHeight = navStatusBarHeight + navTitleBarHeight

/** 底部导航栏 */
export const tabbarHeight = 52

//#ifdef MP-WEIXIN
/** 有效高度 */
export const effectHeight = systemInfo.windowHeight - bottomSafeHeight
//#endif

//#ifndef MP-WEIXIN
/** 有效高度 */
export const effectHeight = systemInfo.windowHeight - navBarHeight - bottomSafeHeight
//#endif

/** 每个动作组数 */
export const actionCount = 10

/** 页大小 */
export const defaultMaxPageSize = 9999

/** 默认排序规则 */
export const defaultSort = "id asc"

/** 网络请求超时时长 */
export const requestTimeout = 12000

/** 防抖延迟 */
export const debounceDelay = 200