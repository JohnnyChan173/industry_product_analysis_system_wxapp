import {
	env
} from "./request";

/** 格式化相对路径 */
export function formatFilePathList(urls) {
	return urls.map(
		relativePath =>
		({
			relativePath,
			url: env.ossUniversalUrl + relativePath,
			name: relativePath
		}))
}

/** 获取OSS文件路径 */
export function getOssFilePath(url) {
	const ossUrl = env.ossUniversalUrl + url
	return ossUrl
}