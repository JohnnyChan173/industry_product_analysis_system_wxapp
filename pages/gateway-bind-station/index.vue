<template>
	<view>
		<!-- 产线信息 -->
		<view class="py-12  pt-16">

			<!-- 网关信息 -->
			<view class="py-12">
				<my-title2 title="网关信息" />
				<view class="px-32 py-12">
					<view
						v-if="gatewayUuid"
						class="detail"
					>
						<u-cell-group :customStyle="{fontSize:'1px'}">
							<u-cell title="网关UUID">
								<text
									slot="value"
									class="co-pr font-size"
								>{{gatewayUuid}}</text>
							</u-cell>
						</u-cell-group>
					</view>
					<p
						v-else
						class="co-999 font-size"
					>请先扫描网关二维码</p>
				</view>
			</view>
			<template >
			<view class="px-32 mb-32">
				<u-button
					type="primary"
					@click="handleScan"
				>
					<span :style="{fontSize: '16px'}">扫描网关</span>
					<u-icon
						name="scan"
						color="#fff"
						:size="24"
					></u-icon>
				</u-button>
			</view>
		</template>

			<my-title2 title="产线信息" />
			<view class="px-32 py-12">
				<view v-if="lineInfo">
					<view class="form-item mb-16">
						<p>产线名称</p>
						<text class="co-pr font-size">{{lineInfo.lineName}}</text>
					</view>
					<view class="form-item">
						<p>工位列表</p>
						<view class="stationList">
							<text
								class="stationList-all co-wa"
								@click="handleCheckAll"
							>全选</text>
							<u-checkbox-group
								v-model="bindList"
								placement="column"
							>
								<u-checkbox
									:customStyle="{marginBottom: '12px'}"
									v-for="(item, index) in stationList"
									:key="index"
									:label="_getStationText(item)"
									:disabled="!_isStationBindModuleUuid(item)"
									:name="item.id"
									:iconSize="16"
									:labelSize="16"
								>
								</u-checkbox>
							</u-checkbox-group>
						</view>
					</view>
				</view>
				<p
					v-else
					class="co-999"
				>请再扫描产线二维码</p>
			</view>
		</view>


		<template >
			<view class="px-32 mb-32">
				<u-button
					type="primary"
					@click="handleScanLine"
				>
					<span :style="{fontSize: '16px'}">扫描产线</span>
					<u-icon
						name="scan"
						color="#fff"
						:size="24"
					></u-icon>
				</u-button>
			</view>
		</template>

		<template v-if="lineInfo">
			<view class="px-32 flex">
				<!-- <u-button
					custom-style="width:150px;"
					type="primary"
					@click="handleScan"
					v-if="bindList.length>0"
				>
					<span :style="{fontSize: '16px'}">更换产线</span>
					<u-icon
						name="scan"
						color="#fff"
						:size="24"
					></u-icon>
				</u-button> -->

				<u-button
					custom-style="margin-left:12px;"
					type="warning"
					@click="handleBind"
				>
					<span :style="{fontSize: '16px'}">一键设置</span>
				</u-button>
			</view>

		</template>
	</view>
</template>

<script>
	import {
		mqttBindModule
	} from '../../api/mqtt';
	import {
		stationBindModuleUuid,
		stationDetail,
		stationListAll,
		stationSetEnablePart,
		stationUnbindModuleUuid
	} from '../../api/station';
	import {
		getValueByScanQrcode,
		getLineInfoByScan
	} from '../../core/scan';
	import {
		delay
	} from '../../utils';
	import {
		errorToast,
		successToast
	} from '../../utils/toast';

	export default {
		data() {
			return {
				gatewayUuid: "",
				lineInfo: "",
				id: "",
				stationList: [],
				bindList: []
			}
		},
		methods: {
			// 检测工位是否绑定模组
			_isStationBindModuleUuid(item) {
				return !!item.moduleUuid
			},

			// 获取工位文案
			_getStationText(item) {
				const {
					moduleUuid,
					gatewayUuid,
					stationName
				} = item

				if (moduleUuid) {
					return `${stationName} [绑网关:${gatewayUuid||'/'}]`
				} else {
					return `${stationName} [未绑模组]`
				}
			},

			/** 一键绑定 */
			async handleBind() {
				const {
					gatewayUuid,
					stationList,
					bindList
				} = this

				if (bindList.length === 0) {
					uni.showModal({
						title: `当前未选择工位，即将执行网关清空绑定操作`,
						content: ``,
						confirmText: "清空绑定",
						async success(res) {
							if (res.confirm) {

								await mqttBindModule({
									gatewayUuid,
									moduleList: []
								})

								successToast("网关清空绑定成功！")
							}
						}
					})
					return
				}


				const moduleList = bindList.map(i => {
					const stationInfo = stationList.find(j => j.id === i)
					return {
						uuid: stationInfo.moduleUuid,
						isUsedAddon: stationInfo.isUsedAddon,
						isUsedWristband: stationInfo.isUsedWristband,
						isUsedGround: stationInfo.isUsedGround,
						isUsedGeneral: stationInfo.isUsedGeneral,
					}
				})

				const filterModuleList = moduleList.filter(i => i.uuid)

				// 判定数据是否合法
				const existModuleEqualsGateway = filterModuleList.find(i => i.uuid === gatewayUuid)
				if (existModuleEqualsGateway) {
					errorToast("存在非法UUID：网关和模块不能相同！")
					return
				}
				console.log('=>>>>>>>>>>>>>>>>>',gatewayUuid,filterModuleList)
				await mqttBindModule({
					gatewayUuid,
					data: filterModuleList
				})

				successToast("网关设置成功")
			},

			/** 通过产线信息更新数据 */
			async syncByLineInfo(lineInfo) {
				const {
					gatewayUuid
				} = this;

				if (lineInfo) {
					this.lineInfo = lineInfo

					const {
						id,
					} = lineInfo

					this.id = id

					// 获取全部工位列表
					const stationList = await stationListAll(id)

					// stationList 加工
					const bindList = stationList.filter(i => i.gatewayUuid === gatewayUuid).map(i => i.id)

					this.stationList = stationList
					this.bindList = bindList
				}
			},

			/** 扫描二维码 */
			async handleScan() {
				const self = this

				// 先扫码获取网关UUID
				const gatewayUuid = await getValueByScanQrcode();
				this.gatewayUuid = gatewayUuid


			},
				/** 扫描产线 */
			async handleScanLine(){
				// 再扫码获取到产线信息
				const lineInfo = await getLineInfoByScan();

				if (lineInfo) {
					this.syncByLineInfo(lineInfo)
					// 再扫码获取网关二维码
				} else {
					errorToast("产线信息不存在")
				}
			},

			/** 全选 */
			handleCheckAll() {
				// 检测当前模式
				const hasBind = this.bindList.some(i => i)
				if (hasBind) {
					this.bindList = this.bindList.map(i => "")
				} else {
					this.bindList = this.stationList.map(i => i.id)
				}
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
			flex: 0 0 px2rem(50);
			white-space: nowrap;
		}
	}

	.stationList {
		position: relative;

		&-all {
			position: absolute;
			right: -28px;
			top: 0;
			text-decoration: underline;
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