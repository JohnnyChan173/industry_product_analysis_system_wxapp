/**
 * @description OTA 模块
 */

class MyOTA {
	constructor() {
		this.versionJsonUrl =
			'https://nbkxpt-source-bucket.oss-cn-hangzhou.aliyuncs.com/gongniu-projects/trust_supply_chain_app/version.json'

		this.getAppUrl = (version) =>
			`https://nbkxpt-source-bucket.oss-cn-hangzhou.aliyuncs.com/gongniu-projects/trust_supply_chain_app/app_${version}.apk`
	}

	checkOTA() {
		const self = this
		return new Promise((resolve, reject) => {
			// 获取云端 manifest.json 中的版本号
			uni.request({
				url: self.versionJsonUrl,
			}).then(rs => {
				const cloudInfo = rs[1].data
				console.log(cloudInfo)
				const {
					versionCode,
					description,
					createDate
				} = cloudInfo
				// 云应用版本号
				const cloudVersionCode = versionCode

				// 获取当前应用的版本号
				plus.runtime.getProperty(plus.runtime.appid, (info) => {

					// 本地应用版本号
					const versionCode = Number(info.versionCode);

					console.log(versionCode, cloudVersionCode)

					// 需要升级
					if (cloudVersionCode > versionCode) {
						// 弹窗 确认用户是否允许升级

						uni.showModal({
							title: '检测应用版本更新',
							content: `- 新版本:  ${cloudVersionCode}\n- 说明:  ${description}\n- 发布时间:  ${createDate} `,
							confirmText: '下载并升级',
							confirmColor: "#65A2FF",
							cancelColor: "#CCC",
						}).then(([err, data]) => {
							if (data.confirm) {
								resolve(cloudVersionCode)
							} else {
								reject('')
							}
						})

					}

				})
			}).catch(err => {
				uni.showToast({
					title: err,
					duration: 2000
				});
			})
		})

	}

	// OTA升级
	toDownloadOTA(cloudVersionCode, {
		onProgress,
		onDownloadOk,
		onDownloadFail
	}) {

		const self = this

		const downloadTask = uni.downloadFile({
			url: self.getAppUrl(cloudVersionCode),
			success: downloadResult => {
				if (downloadResult.statusCode === 200) {
					onDownloadOk(downloadResult)
				} else {
					onDownloadFail('安装包下载失败')
				}
			},
			fail: err => {
				onDownloadFail(err)
			}
		})

		// 监听下载进度
		downloadTask.onProgressUpdate(res => {
			onProgress(res)
		});

	}

}

const ota = new MyOTA()

export default ota
