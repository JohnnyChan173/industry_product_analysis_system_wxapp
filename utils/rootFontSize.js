
// 这里 scss export 变量在 安卓webview 中不适用
// 所以需要单独把 variables.scss 中的 baseWidth 重新定义一遍

const baseWidth = 375

export function getRootFontSize(maxScreen = 620) {
	const {
		windowWidth,
	} = uni.getSystemInfoSync()

	let rootFontSize

	if (windowWidth > maxScreen) {
		rootFontSize = maxScreen / 10 + 'px'
	} else {
		rootFontSize = windowWidth / 10 + 'px'
	}
	console.log(rootFontSize)
	return rootFontSize
}

export function px2rem(num) {
	const w = parseFloat(baseWidth)
	return num / w * 10 + 'rem'

}

export function px2rem2pxNumber(num){
	const w = parseFloat(baseWidth)
	
	return (num / w * 10) * parseInt(getRootFontSize()) 
}