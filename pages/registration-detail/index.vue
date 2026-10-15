<template>
	<view class="ct">
		<!-- 生产登记 -->
		<!-- 	<view class="py-12">
			<my-title2 title="生产登记-产线">
			</my-title2>

			<view
				class="cell"
				style="width: 80%; margin:10px auto;"
				@click="handleScan"
			>
				<view class="cell-field">
					生产产线:
				</view>
				<view class="cell-value">
					{{regInfo.lineInfo && regInfo.lineInfo.lineName }}
				</view>
			</view>
		</view> -->

		<!-- 1.进行中登记 -->
		<view class="py-12">
			<my-title2 title="生产登记-登记信息"></my-title2>
		</view>

		<view
			v-if="regInfo"
			class="px-18 mt-6"
		>
			<registration-detail
				:registrationInfo="regInfo"
				:beatProductNumber="beatProductNumber"
			/>
		</view>

		<view
			v-if="canRegEdit"
			class="px-48 py-24"
		>
			<view v-if="regInfo">
				<u-button
					:customStyle="btn1Style"
					type="primary"
					@click="handleRegistrationEnd"
				>
					<span :style="{fontSize: '16px'}">结束登记</span>
				</u-button>
				<view
					class="underline co-da-l whitespace-nowrap text-right mt-12"
					@click="handleRegistrationDel"
				>删除登记</view>
			</view>
		</view>

		<u-popup
			mode="center"
			:round="5"
			:show="completeModal.visible"
			@close="onCompleteClose"
		>
			<view
				class="p-14 "
				style="width:75vw;"
			>

				<view class="cell">
					<view class="cell-field">
						节拍生产数
					</view>
					<view class="cell-value">
						<span class="co-pr font-size-l">{{beatProductNumber}}</span>
					</view>
				</view>

				<view class="cell">
					<view class="cell-field">
						实际生产数
					</view>
					<view class="cell-value">
						<u-number-box
							buttonSize="32"
							iconStyle="font-size:12px;"
							min="0"
							v-model="actualProductNumber"
						/>
					</view>
				</view>

				<view class="complte-tip co-wa p-14">- 产品实际生产数量，将作为最终生产数量，请基于产线实际情况确认；</view>

				<u-button
					type="primary"
					@click="handleCompleteSubmit"
				>确认</u-button>
			</view>
		</u-popup>

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
		registrationGetByLatest,
		registrationLatestBeatProductNumber,
		registrationList
	} from "@/api/registration";
	import {
		RegistrationStatus
	} from "@/config/enums";
	import {
		lineGetByUuid
	} from "@/api/line";
	import {
		productTaskGetByTaskNo
	} from "@/api/productTask";

	import {
		errorToast,
		simpleToast,
		successToast
	} from "@/utils/toast";
	import {
		getValueByScanQrcode
	} from "@/core/scan"
	import {
		genQuery
	} from "@/utils";
	import RegistrationDetail from "@/pagesComponents/registration-detail/index.vue";
	export default {

		computed: {
			...mapGetters(["userId", "isXianZhang", "manageLineId"]),
			canRegEdit() {
				const {
					regInfo
				} = this
				return regInfo && regInfo.registrationStatus === RegistrationStatus.IN_REGISTRATION
			},
		},
		data() {
			return {
				scanInputStyle: {
					height: "36px",
					border: "1px solid #ccc !important"
				},
				scanBtnIconStyle: {
					fontSize: "32px",
					color: "#057AFF"
				},
				btn1Style: {
					border: "1px solid var(--color-primary)",
					color: "var(--color-primary)",
					background: "#EBF7FF",
				},

				id: "",
				regInfo: "",

				beatProductNumber: "",
				actualProductNumber: "",
				completeModal: {
					visible: false,
					options: [],
					virtualStationId: 0,
					staffId: 0
				},
			}
		},
		components: {
			RegistrationDetail
		},
		onLoad(opts) {
			const {
				id
			} = opts
			this.id = id ? Number(id) : ""
		},
		onShow() {
			this.toGetRegLatestBeat(this.id)
		},
		async mounted() {
			await this.toGetNeedInfo();
		},

		methods: {
			/** 完成确认*/
			async handleCompleteSubmit() {

				// 简单校验
				const {
					regInfo,
					actualProductNumber
				} = this

				if (actualProductNumber === undefined) {
					errorToast("请填写实际生产数")
					return
				}

				await registrationEnd(regInfo.id, actualProductNumber)
				await this.toGetNeedInfo();
				successToast("操作成功")
				this.completeModal.visible = false
			},

			/** 完成关闭 */
			onCompleteClose() {
				this.completeModal.visible = false
			},

			/** 生产登记结束 */
			async handleRegistrationEnd() {
				const {
					id
				} = this.regInfo

				const self = this;

				this.completeModal.visible = true

				await this.toGetRegLatestBeat(this.id)

				this.actualProductNumber = this.beatProductNumber

			},

			/** 生产登记删除 */
			async handleRegistrationDel() {
				const {
					id
				} = this.regInfo

				const self = this;

				uni.showModal({
					title: `确认删除本次生产登记？节拍生产信号将重置。`,
					content: ``,
					confirmText: "确认删除",
					async success(res) {
						if (res.confirm) {
							// 结束登记
							await registrationDel(id)
							successToast("操作成功")
							uni.navigateBack()
						}
					}
				})

			},

			/** 获取登记记录 */
			async toGetRegistrationRecord() {
				const {
					id
				} = this

				const regInfo = await registrationDetail(id)
				const isDoing = regInfo.registrationStatus === RegistrationStatus.IN_REGISTRATION

				// 如果是进行中登记
				if (isDoing) {
					this.toGetRegLatestBeat(id)
				}

				this.regInfo = regInfo
			},

			/** 获取节拍生产数 */
			async toGetRegLatestBeat(id) {
				// 获取最新节拍生产数量
				const beatProductNumber = await registrationLatestBeatProductNumber(id)
				this.beatProductNumber = beatProductNumber
			},

			/** 获取必要信息 */
			async toGetNeedInfo() {
				uni.showLoading({
					title: "载入中..."
				})

				await this.toGetRegistrationRecord();

				uni.hideLoading()
			}
		}

	}
</script>

<style
	lang="scss"
	scoped
>
	.ct {
		padding-bottom: 45px;
	}

	.historyBtn {
		border-radius: 0;
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