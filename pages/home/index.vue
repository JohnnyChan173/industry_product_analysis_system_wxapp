<template>
	<page-meta :root-font-size="getRootFontSize()"> </page-meta>
	<view class="content">
		<!-- 页面主体 -->
		<view class="mainPage">
			<my-registration
				v-if="isRegistrationComponent"
				ref="registrationRef"
			/>

			<!-- 	<my-product-task
				v-if="isProductTaskComponent"
				ref="productTaskRef"
			/> -->

			<my-addon
				v-if="isAddonComponent"
				ref="addonRef"
			/>

			<my-setting v-if="isSettingComponent" />
		</view>

		<!-- 底部导航 -->
		<u-tabbar
			:key="Math.random()"
			:value="curTab"
			@change="handleTarbarChange"
			activeColor="#65a2ff"
		>
			<template v-for="tab in renderTabs">
				<u-tabbar-item
					:key="tab.name"
					:text="tab.name"
					:name="tab.value"
				>
					<view
						slot="inactive-icon"
						class="mb-4"
					>
						<u-icon
							:name="tab.icon"
							color="#999"
							:size="iconSize"
						></u-icon>
					</view>
					<view
						slot="active-icon"
						class="mb-4"
					>
						<u-icon
							:name="tab.icon"
							color="#3c9cff"
							:size="iconSize"
						></u-icon>
					</view>
				</u-tabbar-item>
			</template>
		</u-tabbar>

		<!-- 弹窗组件开设 -->
		<u-toast ref="uToast"></u-toast>

		<!-- 弹窗 - 应用 OTA -->
		<u-modal
			width
			width="320"
			:showConfirmButton="false"
			:show="otaShow"
			:title="otaTitle"
			:content='otaContent'
		></u-modal>
	</view>

</template>

<script>
	import MyRegistration from '@/pages/home/registration/index.vue'
	import MyAddon from '@/pages/home/addon/index.vue'
	import MySetting from '@/pages/home/setting/index.vue'
	import ota from '@/ota'
	import {
		mapGetters
	} from "vuex"

	export default {
		data() {
			return {
				iconSize: 24,
				tabs: [{
						value: 0,
						name: "生产登记",
						icon: "order",
					},
					// {
					// 	value: 1,
					// 	name: "生产任务单",
					// 	icon: "list-dot",
					// },
					{
						value: 2,
						name: "安灯事件",
						icon: "share",
					}, {
						value: 3,
						name: "设置",
						icon: "setting",
					}
				],
				renderTabs: [],
				curTab: null, // 0 线体列表；1 设置页

				// OTA 字段
				otaTitle: '应用升级中...',
				otaContent: '',
				otaShow: false
			}
		},
		computed: {
			...mapGetters(["userId", "staffType", "isMain", "isXianZhang", "isEvent", "isWareHouse"]),
			isRegistrationComponent() {
				return this.curTab === 0
			},
			// isProductTaskComponent() {
			// 	return this.curTab === 1
			// },
			isAddonComponent() {
				return this.curTab === 2
			},
			isSettingComponent() {
				return this.curTab === 3
			},
		},
		watch: {
			staffType(v) {
				this.initTabs()
			}
		},
		components: {
			MyRegistration,
			MyAddon,
			MySetting
		},
		async onLoad() {
			// #ifdef APP-PLUS
			this.appPlusOTA()
			// #endif

			// let title = `${enterpriseName}-${staffName}`
			// 改变标题
			// uni.setNavigationBarTitle({
			// 	title
			// })

			this.initTabs()
		},
		onShow() {
			this.initComponentData()
		},

		methods: {
			initTabs() {
				let tabs = this.tabs.slice()

				// 主账号&线长 保留全部模块
				if (this.isMain || this.isXianZhang) {
					tabs = tabs
				} else if (this.isEvent) {
					// 安灯管理员 移除生产登记
					tabs = tabs.filter(i => i.name !== "生产登记")
				}

				this.renderTabs = tabs
				this.curTab = tabs[0].value
			},

			initComponentData() {
				const registrationRef = this.$refs.registrationRef
				const addonRef = this.$refs.addonRef
				const productTaskRef = this.$refs.productTaskRef

				if (registrationRef) {
					registrationRef.toGetNeedInfo()
				} else if (productTaskRef) {
					productTaskRef.toGetNeedInfo()
				} else if (addonRef) {
					addonRef.toGetNeedInfo()
				}
			},

			handleTarbarChange(val) {
				this.curTab = val
			},
			appPlusOTA() {
				const self = this

				// 获取当前应用的版本号
				plus.runtime.getProperty(plus.runtime.appid, (info) => {

					// 本地应用版本号
					const versionCode = Number(info.versionCode);
					self.versionCode = versionCode
				})

				// ota 检测
				ota.checkOTA()
					.then(cloudVersionCode => {

						// 开启升级弹窗
						self.otaShow = true

						ota.toDownloadOTA(cloudVersionCode, {
							onProgress(res) {
								const progress = res.progress
								self.otaContent = `应用下载进度: ${progress}%`
							},
							onDownloadOk(downloadResult) {
								// 因为应用要直接进行更新 没必要隐藏弹窗
								self.otaShow = false
								plus.runtime.install(downloadResult.tempFilePath)
							},
							onDownloadFail(err) {
								uni.showToast({
									title: err,
									duration: 2000
								});
								self.otaShow = false
							}
						})
					}).catch(err => {
						console.log(err)
					})
			}

		}
	}
</script>

<style
	lang="scss"
	scoped
>

</style>