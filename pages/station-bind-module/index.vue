<template>
	<view>
		<!-- 工位信息 -->
		<view class="py-12 pt-16">
			<my-title2 title="工位信息" />
			<view class="px-32 py-12">
				<view
					v-if="stationInfo"
					class="detail"
				>
					<u-cell-group :customStyle="{fontSize:'14px'}">
						<!-- 		<u-cell title="所属产线">
							<text
								slot="value"
								class="co-pr"
							>{{addonInfo.eventNo}}</text>
						</u-cell> -->
						<u-cell title="工位编号">
							<text
								slot="value"
								class="co-pr"
							>{{stationInfo.stationNo}}</text>
						</u-cell>
						<u-cell title="工位名称">
							<text
								slot="value"
								class="co-pr"
							>{{stationInfo.stationName}}</text>
						</u-cell>
						<u-cell title="绑定模组">
							<div slot="value">
								<text
									v-if="stationInfo.moduleUuid"
									class="co-pr"
								>{{stationInfo.moduleUuid}}</text>
								<text
									v-else
									class="co-999"
								>无</text>
							</div>
						</u-cell>
					</u-cell-group>
				</view>
				<p
					v-else
					class="co-999"
				>请先扫描工位二维码</p>
			</view>
		</view>
		<template v-if="!stationInfo">
			<view class="px-32 mb-32">
				<u-button
					type="primary"
					@click="handleScan"
				>
					<span :style="{fontSize: '16px'}">扫描工位</span>
					<u-icon
						name="scan"
						color="#fff"
						:size="24"
					></u-icon>
				</u-button>
			</view>
		</template>

		<!-- 模组信息 -->
		<view class="py-12 ">
			<my-title2 title="模组信息" />
			<view class="px-32 py-12">
				<view v-if="moduleUuid">
					<view class="form-item">
						<p>模组UUID</p>
						<u-tag
							size="large"
							:text="moduleUuid"
							plain
							plainFill
						> </u-tag>
					</view>
					<view class="form-item">
						<p>通用输入模块</p>
						<p>
							<u-radio-group
								:key="Math.random()"
								v-model="isUsedGeneral"
								placement="row"
								:disabled="!!stationInfo.moduleUuid"
							>
								<u-radio
									:customStyle="{marginRight: '8px'}"
									v-for="(item, index) in enableCheckboxList"
									:key="index"
									:label="item.label"
									:name="item.name"
								>
								</u-radio>
							</u-radio-group>
						</p>
					</view>
					<view class="form-item">
						<p>安灯事件模块</p>
						<p>
							<u-radio-group
								v-model="isUsedAddon"
								placement="row"
								:disabled="!!stationInfo.moduleUuid"
							>
								<u-radio
									:customStyle="{marginRight: '8px'}"
									v-for="(item, index) in enableCheckboxList"
									:key="index"
									:label="item.label"
									:name="item.name"
								>
								</u-radio>
							</u-radio-group>

						</p>
					</view>
					<view class="form-item">
						<p>静电手环模块</p>
						<p>
							<u-radio-group
								v-model="isUsedWristband"
								placement="row"
								:disabled="!!stationInfo.moduleUuid"
							>
								<u-radio
									:customStyle="{marginRight: '8px'}"
									v-for="(item, index) in enableCheckboxList"
									:key="index"
									:label="item.label"
									:name="item.name"
								>
								</u-radio>
							</u-radio-group>

						</p>
					</view>
					<view class="form-item">
						<p>设备接地模块</p>
						<p>
							<u-radio-group
								v-model="isUsedGround"
								placement="row"
								:disabled="!!stationInfo.moduleUuid"
							>
								<u-radio
									:customStyle="{marginRight: '8px'}"
									v-for="(item, index) in enableCheckboxList"
									:key="index"
									:label="item.label"
									:name="item.name"
								>
								</u-radio>
							</u-radio-group>

						</p>
					</view>
				</view>
				<p
					v-else
					class="co-999"
				>请先扫描模组二维码</p>
			</view>
		</view>

		<template  v-if="!stationInfo||!stationInfo.moduleUuid">
			<view class="px-32 mb-32">
				<u-button
					type="primary"
					@click="handleScanModule('add')"
				>
					<span :style="{fontSize: '16px'}">扫描模组</span>
					<u-icon
						name="scan"
						color="#fff"
						:size="24"
					></u-icon>
				</u-button>
			</view>
		</template>

		<template v-if="stationInfo">
			<view class="px-32 flex">
				<u-button
				v-if="stationInfo.moduleUuid"
					custom-style="width:180px;"
					type="primary"
					@click="handleScanModule('edit')"
				>
					<span :style="{fontSize: '16px'}">更换模组</span>
					<u-icon
						name="scan"
						color="#fff"
						:size="24"
					></u-icon>
				</u-button>

				<u-button
					v-if="stationInfo.moduleUuid"
					custom-style="margin-left: 12px"
					type="error"
					@click="handleUnbind"
				>
					<span :style="{fontSize: '16px'}">解除绑定</span>
				</u-button>

				<u-button
					v-else
					custom-style="margin-left: 12px"
					type="warning"
					@click="handleBind"
				>
					<span :style="{fontSize: '16px'}">一键绑定</span>
				</u-button>
			</view>

		</template>
	</view>
</template>

<script>
	import {
		stationBindModuleUuid,
		stationDetail,
		stationSetEnablePart,
		stationUnbindModuleUuid
	} from '../../api/station';
	import {
		getValueByScanQrcode,
		getStationInfoByScan
	} from '../../core/scan';
	import {
		delay
	} from '../../utils';
	import {
		simpleToast,
		successToast
	} from '../../utils/toast';
	export default {
		data() {
			return {
				stationInfo: "",

				id: "",
				moduleUuid: "",
				isUsedAddon: 1,
				isUsedWristband: 1,
				isUsedGround: 1,
				isUsedGeneral: 1,

				enableCheckboxList: [{
					label: "具备",
					name: 1
				}, {
					label: "不具备",
					name: 0
				}]
			}
		},
		methods: {
			/** 一键解绑 */
			async handleUnbind(callBack) {
				const {
					id
				} = this

				const self = this
				if(callBack){
					await stationUnbindModuleUuid(id)
					self.moduleUuid = ""
					callBack&& await callBack();
					this.handleBind()
					return
				}
				uni.showModal({
					title: `确认解除绑定？解除后可重新绑定。`,
					content: ``,
					confirmText: "解除",
					async success(res) {
						if (res.confirm) {
							await stationUnbindModuleUuid(id)
							self.stationInfo = ""
							self.moduleUuid = ""
							successToast("解绑成功")
						
							// await delay(500)
							// uni.navigateBack()
						}
					}
				})
			},

			/** 一键绑定 */
			async handleBind() {
				const {
					id,
					moduleUuid,
					isUsedAddon,
					isUsedGeneral,
					isUsedGround,
					isUsedWristband
				} = this
				await stationBindModuleUuid(id, moduleUuid)
				await stationSetEnablePart({
					id,
					isUsedAddon,
					isUsedGeneral,
					isUsedGround,
					isUsedWristband
				})

				await this.toUpdateStationInfo()

				successToast("绑定成功")

			},

			/** 更新工位信息 */
			async toUpdateStationInfo() {
				const {
					id
				} = this

				const stationInfo = await stationDetail(id)
				this.syncByStationInfo(stationInfo)
			},

			/** 通过工位信息更新数据 */
			async syncByStationInfo(stationInfo) {
				if (stationInfo) {
					this.stationInfo = stationInfo

					const {
						id,
						moduleUuid,
						isUsedAddon,
						isUsedWristband,
						isUsedGround,
						isUsedGeneral
					} = stationInfo

					this.id = id

					// 如果模组存在，则直接同步
					if (moduleUuid) {
						simpleToast("当前工位已绑定模组!");
						this.moduleUuid = moduleUuid
						this.isUsedAddon = isUsedAddon
						this.isUsedWristband = isUsedWristband
						this.isUsedGround = isUsedGround
						this.isUsedGeneral = isUsedGeneral
					} else {
						// 如果模组uuid不存在，则继续触发扫描
						// const moduleUuid = await getValueByScanQrcode();
						// this.moduleUuid = moduleUuid
						this.isUsedAddon = 1
						this.isUsedWristband = 1
						this.isUsedGround = 1
						this.isUsedGeneral = 1
					}
				}
			},

			/** 扫描二维码 */
			async handleScan() {
				const self = this

				// 先扫码获取工位信息
				const stationInfo = await getStationInfoByScan();
				this.syncByStationInfo(stationInfo)
			},
			async handleScanModule(type) {
				const self = this
				const callBack =async ()=>{
					const moduleUuid = await getValueByScanQrcode();
						this.moduleUuid = moduleUuid
						this.isUsedAddon = 1
						this.isUsedWristband = 1
						this.isUsedGround = 1
						this.isUsedGeneral = 1
				}
				type=='edit'? await	this.handleUnbind(callBack):callBack();
				// 先扫码获取工位信息
					
				// this.syncByStationInfo(stationInfo)
			}
		}
	}
</script>

<style
	lang="scss"
	scoped
>
	.form-item {
		>p:nth-child(1) {
			padding: 10px 0;
			flex: 0 0 px2rem(100);
		}
	}

	::v-deep {
		&.detail {
			border: 1px solid #ccc;

			.u-cell__body {
				font-size: px2rem(14);
				padding: px2rem(4) px2rem(15);
			}

			.u-cell__title-text {
				font-size: px2rem(14);
			}
		}
	}
</style>