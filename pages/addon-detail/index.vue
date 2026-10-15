<template>
	<view>
		<!-- 1.事件信息 -->
		<view class="px-14 pt-16">
			<my-headline
				border
				title="1.事件信息"
			/>
		</view>
		<view class="px-18 mt-6">
			<addon-detail
				v-if="addonInfo"
				:addonInfo="addonInfo"
			/>
		</view>

		<!-- 2.处理信息 -->
		<view class="px-14 pt-16">
			<my-headline
				border
				title="2.处理信息"
			/>
		</view>

		<view class="px-18 my-12">
			<view v-if="isReady">
				<text class="co-999">请先前往工位接收事件，才能进行处理。</text>
			</view>

			<view v-else-if="isInvalid">
				<text class="co-999 font-size-l">无效事件</text>
			</view>

			<view v-else-if="isProcessing">
				<view class="flex my-16">
					<text>处理方式：</text>
					<u-input
						placeholder="若处理,需必填此项"
						v-model="handleMethod"
					/>
				</view>

				<view class="flex">
					<u-button
						:custom-style="{fontSize:'16px',border: '1px solid #aaa',width: '160px',marginRight:'8px'}"
						plain
						@click="handleInvalid"
					>
						<span :style="{fontSize:'16px'}">无效事件</span>
					</u-button>

					<u-button
						type="primary"
						@click="handleSubmit"
					>
						<span :style="{fontSize:'16px'}">处理</span>
					</u-button>
				</view>
			</view>

			<view v-else-if="isProcessed">
				<text class="co-su font-size-l">已处理：{{addonInfo.handleMethod}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import {
		registrationDel,
		registrationDetail,
		registrationEnd,
		registrationList
	} from "@/api/registration";
	import TagRegistrationStatus from "@/pagesComponents/tag-registration-status/index.vue";
	import AddonDetail from "@/pagesComponents/addon-detail/index.vue";
	import {
		AddonEventStatus,
		RegistrationStatus
	} from "@/config/enums";
	import {
		infoToast,
		successToast
	} from "@/utils/toast";
	import {
		addonEventDetail,
		addonEventHandle,
		addonEventInvalid
	} from "../../api/addonEvent";

	export default {
		computed: {
			...mapGetters(["userId"]),
			isReady() {
				const {
					addonInfo
				} = this

				if (addonInfo) {
					return addonInfo.eventStatus === AddonEventStatus.READY
				}
			},
			isProcessing() {
				const {
					addonInfo
				} = this

				if (addonInfo) {
					return addonInfo.eventStatus === AddonEventStatus.PROCESSING
				}
			},
			isInvalid() {
				const {
					addonInfo
				} = this

				if (addonInfo) {
					return addonInfo.eventStatus === AddonEventStatus.INVALID
				}
			},
			isProcessed() {
				const {
					addonInfo
				} = this

				if (addonInfo) {
					return addonInfo.eventStatus === AddonEventStatus.PROCESSED
				}
			},
		},
		data() {
			return {
				id: "",
				addonInfo: "",
				handleMethod: ""
			}
		},
		components: {
			TagRegistrationStatus,
			AddonDetail
		},
		onLoad(opts) {
			this.id = opts.id
		},
		async mounted() {
			await this.toGetNeedInfo();
		},
		methods: {
			/** 无效事件 */
			async handleInvalid() {
				const {
					id
				} = this

				const self = this;

				uni.showModal({
					title: `确认当前为无效事件？`,
					content: ``,
					confirmText: "确认",
					async success(res) {
						if (res.confirm) {
							// 结束生产
							await addonEventInvalid(id)
							await self.toGetNeedInfo();
							successToast("操作成功")
						}
					}
				})
			},

			/** 处理事件 */
			async handleSubmit() {
				const {
					id,
					handleMethod
				} = this

				// 简单校验
				if (!handleMethod) {
					infoToast("请填写处理方式")
					return
				}

				await addonEventHandle({
					id,
					handleMethod
				})

				await this.toGetNeedInfo();
				successToast("操作成功")
			},

			/** 获取安灯信息 */
			async toGetAddonInfo() {
				const {
					id
				} = this

				const addonInfo = await addonEventDetail(id);
				this.addonInfo = addonInfo
			},
			/** 获取必要信息 */
			async toGetNeedInfo() {
				uni.showLoading({
					title: "载入中..."
				})

				// 获取安灯信息
				await this.toGetAddonInfo();

				uni.hideLoading()
			}
		}

	}
</script>

<style
	lang="scss"
	scoped
>
	.btn1 {
		border: 1px solid var(--color-primary);
		color: var(--color-primary);
		background: #EBF7FF;
	}

	.historyBtn {
		border-radius: 0;
		// border-top-left-radius: px2rem(9999);
		// border-bottom-left-radius: px2rem(9999);
		border: 1px solid var(--color-warn);
		color: var(--color-warn);
		font-size: px2rem(12);
		font-weight: bold;
		padding: px2rem(4) px2rem(6);
		background: #fff8e2;
		@include center;
	}

	.historyModalPanel {
		width: 80vw;
		min-height: 35vh;
		max-height: 85vh;
		overflow: auto;
	}
</style>