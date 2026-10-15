<template>
	<view class="detail">
		<u-cell-group :customStyle="{fontSize:'12px'}">
			<u-cell title="登记编号">
				<text slot="value">{{registrationInfo.registrationNo}}</text>
			</u-cell>
			<u-cell title="关联任务单">
				<view slot="value">
					<text v-if="registrationInfo.taskInfo">{{registrationInfo.taskInfo.taskNo}}</text>
					<text
						v-else
						class="co-999"
					>/</text>
				</view>
			</u-cell>
			<u-cell title="登记产线">
				<text slot="value">{{registrationInfo.lineInfo.lineName}}</text>
			</u-cell>
			<u-cell title="生产产品">
				<text slot="value">{{registrationInfo.productInfo.productName}}</text>
			</u-cell>
			<u-cell title="开始时间">
				<text slot="value">{{registrationInfo.startDate||'/'}}</text>
			</u-cell>
			<u-cell title="结束时间">
				<text slot="value">{{registrationInfo.endDate||'/'}}</text>
			</u-cell>
			<u-cell title="生产进度">
				<view slot="value">
					<span class="font-size-l">{{registrationInfo.beatProductNumber || beatProductNumber}} / {{ registrationInfo.planProductNumber }}</span>
				</view>
			</u-cell>
			<u-cell title="实际生产">
				<view slot="value">
					<span class="co-pr font-size-l">{{registrationInfo.actualProductNumber || "/" }} </span>
				</view>
			</u-cell>
			<u-cell title="登记状态">
				<tag-registration-status
					slot="value"
					:registrationInfo="registrationInfo"
				/>
			</u-cell>
			<u-cell title="员工考勤">
				<text slot="value">{{ getStaffSignedRatio(registrationInfo.staffSignList)}}</text>
			</u-cell>
			<u-cell title="备注">
				<text slot="value">{{registrationInfo.memo||'/'}}</text>
			</u-cell>
			<u-cell title="拍照存证">
				<view
					slot="title"
					class="whitespace-nowrap pr-24"
				>拍照存证</view>
				<view
					slot="value"
					style="text-align:right;"
				>
					<u-upload
						:fileList="filePathList"
						multiple
						:maxCount="filePathList.length"
						:disabled="true"
					></u-upload>
					<text v-if="!filePathList.length">无</text>
				</view>
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	import {
		RegistrationStatus
	} from "../../config/enums";
	import {
		getOssFilePath
	} from "../../config/format";
	import {
		getStaffSignedRatio
	} from "../../config/parse";
	import TagRegistrationStatus from "../tag-registration-status/index.vue";

	export default {
		options: {
			styleIsolation: 'shared', // 解除样式隔离
		},
		props: ["registrationInfo", "beatProductNumber"],
		computed: {
			filePathList() {
				const {
					filePathList
				} = this.registrationInfo
				if (Array.isArray(filePathList)) {
					const fl = filePathList.map(i => ({
						url: getOssFilePath(i)
					}))
					return fl
				} else {
					return []
				}
			},
			isDoing() {
				const {
					registrationInfo
				} = this
				return registrationInfo.registrationStatus === RegistrationStatus.IN_REGISTRATION
			}
		},
		data() {
			return {
				getStaffSignedRatio
			}
		},
		components: {
			TagRegistrationStatus
		},

	}
</script>

<style
	lang="scss"
	scoped
>
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