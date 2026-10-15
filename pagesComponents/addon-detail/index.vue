<template>
	<view class="detail">
		<u-cell-group :customStyle="{fontSize:'12px'}">
			<u-cell title="事件编号">
				<text slot="value">{{addonInfo.eventNo}}</text>
			</u-cell>
			<u-cell title="虚拟产线">
				<text
					slot="value"
					class="co-pr"
				>{{addonInfo.virtualLineInfo.virtualLineName}}</text>
			</u-cell>
			<u-cell title="虚拟工位">
				<text
					slot="value"
					class="co-pr"
				>{{addonInfo.virtualStationInfo.virtualStationName}}</text>
			</u-cell>
			<u-cell title="生产产品">
				<view slot="value">
					<u-tag
						:text="addonInfo.productInfo.productName"
						type="primary"
						plain
					></u-tag>
				</view>
			</u-cell>
			<u-cell title="呼叫时间">
				<text slot="value">{{addonInfo.happenDate}}</text>
			</u-cell>
			<u-cell title="事件类型">
				<text
					slot="value"
					class="co-wa"
				>{{getListItemLabel(AddonEventTypeList,addonInfo.eventType)}}</text>
			</u-cell>
			<u-cell title="事件管理员">
				<view slot="value">
					{{ addonInfo.eventStaffInfo && addonInfo.eventStaffInfo.staffName }}
				</view>
			</u-cell>
			<u-cell title="事件状态">
				<view slot="value">
					<tag-addon-status :addonInfo="addonInfo" />
				</view>
			</u-cell>
			<u-cell title="接收时间">
				<text slot="value">{{addonInfo.receiveDate || ""}}</text>
			</u-cell>
			<u-cell title="处理时间">
				<text slot="value">{{addonInfo.handleDate || ""}}</text>
			</u-cell>
			<u-cell title="处理方式">
				<text slot="value">{{addonInfo.handleMethod || ""}}</text>
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	import {
		getStaffSignedRatio
	} from "../../config/parse";
	import TagRegistrationStatus from "../tag-registration-status/index.vue";
	import TagAddonStatus from "../tag-addon-status/index.vue";
	import {
		getListItemLabel,
		AddonEventTypeList
	} from "../../config/data";

	export default {
		options: {
			styleIsolation: 'shared', // 解除样式隔离
		},
		props: ["addonInfo"],
		data() {
			return {
				getListItemLabel,
				AddonEventTypeList,

				getStaffSignedRatio
			}
		},

		components: {
			TagRegistrationStatus,
			TagAddonStatus
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