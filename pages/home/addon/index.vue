<template>
	<view>
		<!-- 顶部导航栏 -->
		<view
			class="navbar"
			:style="{height: searchBarHeight +'px'}"
		>
			<!-- 工具栏 -->
			<view class="relative flex px-12 py-12">
				<my-tool-nav
					defaultLabel="产线"
					:list="lineSelectList"
					:value.sync="lineSelectValue"
				/>
				<my-tool-nav
					defaultLabel="事件类型"
					:list="eventTypeSelectList"
					:value.sync="eventTypeSelectValue"
				/>
				<my-tool-nav
					defaultLabel="事件状态"
					:list="eventStatusSelectList"
					:value.sync="eventStatusSelectValue"
				/>
				<span
					class="co-pr ml-6"
					@click="handleResetParams"
				>重置</span>
			</view>

			<!-- 搜索框 -->
			<view class="px-12">
				<u-search
					placeholder="输入事件编号查询"
					v-model="keyword"
					shape="square"
					:showAction="false"
				></u-search>
			</view>
		</view>

		<!-- 表格区 -->
		<my-scroll
			:minus="searchBarHeight+tabBarHeight"
			@scrollToEnd="onScrollEnd"
		>
			<view class="px-10">

				<my-table
					:dataSource="dataSource"
					:columns="columns"
					:font-size="14"
					:loading="loading"
					@click="handleAddonClick"
				>
					<template v-slot:bodyCell="{text, record, index, column}">
						<template v-if="column.dataIndex==='happenDate'">
							<div>
								<p>
									{{record.happenDate1}}
								</p>
								<p>
									{{record.happenDate2}}
								</p>
							</div>
						</template>
						<template v-if="column.dataIndex==='virtualStationInfo'">
							{{record.virtualStationInfo.virtualStationName}}
						</template>
						<template v-if="column.dataIndex==='eventType'">
							<tag-addon-type :addonInfo="record"></tag-addon-type>
						</template>
						<template v-if="column.dataIndex==='eventStatus'">
							<tag-addon-status :addonInfo="record"></tag-addon-status>
						</template>
					</template>
				</my-table>
			</view>
			<p
				v-if="isPageEnd"
				class="flex justify-center co-999 p-6"
			>数据已全部加载!</p>
		</my-scroll>
	</view>
</template>

<script>
	import {
		addonEventList
	} from '@/api/addonEvent'
	import {
		defaultMaxPageSize
	} from '@/config'
	import {
		AddonEventTypeList,
		AddonEventStatusList,
		getListItemLabel
	} from '@/config/data'
	import {
		debounce
	} from '@/utils/index'
	import {
		columns
	} from './table'
	import {
		AddonEventType,
		AddonEventStatus,
	} from "@/config/enums"
	import TagAddonStatus from "@/pagesComponents/tag-addon-status"
	import TagAddonType from "@/pagesComponents/tag-addon-type"
	import {
		mapGetters
	} from "vuex"
	import {
		lineDetail
	} from '../../../api/line'

	export default {
		components: {
			TagAddonStatus,
			TagAddonType
		},
		computed: {
			...mapGetters(["isXianZhang", "manageLineId", "isEvent", "staffId"]),
			searchParams() {
				const {
					keyword,
					lineSelectValue,
					eventTypeSelectValue,
					eventStatusSelectValue
				} = this

				return {
					keyword,
					lineSelectValue,
					eventTypeSelectValue,
					eventStatusSelectValue
				}
			},

		},
		watch: {
			searchParams() {
				this.toGetList()
			}
		},
		data() {
			return {
				getListItemLabel,
				AddonEventType,
				AddonEventStatus,
				AddonEventTypeList,
				AddonEventStatusList,

				searchBarHeight: 86,
				tabBarHeight: 50,

				columns,
				dataSource: [],
				loading: false,

				pageNum: 1,
				pageSize: 20,
				sort: "id desc",
				total: 0,
				isPageEnd: false,
				keyword: "",

				lineSelectList: [],
				lineSelectValue: null,

				eventTypeSelectList: AddonEventTypeList,
				eventStatusSelectList: AddonEventStatusList,

				eventTypeSelectValue: null,
				eventStatusSelectValue: null,

			}
		},
		mounted(opts) {
			this.toGetNeedInfo()
		},
		methods: {
			onScrollEnd() {
				console.log('end')
				this.toGetList(true)
			},

			/** 点击-表格订单 */
			handleAddonClick(record) {
				const {
					id,
				} = record

				uni.navigateTo({
					url: `/pages/addon-detail/index?id=${id}`
				})
			},

			/** 请求必要信息 */
			async toGetNeedInfo() {
				await this.toGetLineSelectList()
				await this.toGetList()
			},

			handleResetParams() {
				this.keyword = ""
				this.lineSelectValue = null
				this.eventTypeSelectValue = null
				this.eventStatusSelectValue = null
				console.log(this)
			},

			async toGetLineSelectList() {
				const {
					manageLineId
				} = this

				if (manageLineId) {
					const lineInfo = await lineDetail(manageLineId)
					const selectList = [{
						label: lineInfo.lineName,
						value: manageLineId
					}]
					this.lineSelectList = selectList
					this.lineSelectValue = manageLineId
				}
			},

			toGetList: debounce(async function(
				append = false) {

				if (append) {
					if (this.dataSource.length < this.total) {
						this.pageNum++
					} else {
						this.isPageEnd = true;
						return
					}
				} else {
					this.pageNum = 1
				}

				const {
					pageNum,
					pageSize,
					sort,
					keyword,
					eventTypeSelectValue: eventType,
					eventStatusSelectValue: eventStatus
				} = this

				const data = {
					pageNum,
					pageSize,
					sort,
					keyword,
					eventType,
					eventStatus
				}

				// 如果是线长
				if (this.isXianZhang) {
					data.lineId = this.manageLineId
				} else if (this.isEvent) {
					// 如果是事件管理员 
					data.eventStaffId = this.staffId
				}

				this.loading = true

				const {
					records,
					total
				} = await addonEventList(data)

				this.loading = false

				// 小程序内作用域插槽无法使用方法，对时间的渲染需要预先设置值
				records.forEach(i => {
					const [d1, d2] = i.happenDate.split(" ")
					i.happenDate1 = d1
					i.happenDate2 = d2
				})

				if (append) {
					this.dataSource = [...this.dataSource, ...records]
				} else {
					this.dataSource = records
					this.total = total
				}

			}, 200),

		}
	}
</script>

<style
	lang="scss"
	scoped
>
	.navbar {
		position: relative;
		border-bottom: 1px solid #ccc;
	}
</style>