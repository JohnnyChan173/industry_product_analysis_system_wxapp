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
					defaultLabel="登记状态"
					:list="registrationStatusSelectList"
					:value.sync="registrationStatusSelectValue"
				/>
				<span
					class="co-pr ml-6"
					@click="handleResetParams"
				>重置</span>
			</view>

			<!-- 搜索框 -->
			<view class="px-12">
				<u-search
					placeholder="输入登记编号查询"
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
					@click="handleDetailClick"
				>
					<template v-slot:bodyCell="{text, record, index, column}">
						<template v-if="column.dataIndex==='startDate'">
							<div>
								<p>
									{{record.startDate1}}
								</p>
								<p>
									{{record.startDate2}}
								</p>
							</div>
						</template>
						<template v-if="column.dataIndex==='lineInfo'">
							{{record.lineInfo.lineName}}
						</template>
						<template v-if="column.dataIndex==='taskInfo'">
							<span v-if="record.taskInfo">{{record.taskInfo.taskNo}}</span>
							<span v-else>/</span>
						</template>
						<template v-if="column.dataIndex==='registrationStatus'">
							<tag-registration-status :registrationInfo="record"></tag-registration-status>
						</template>
					</template>
				</my-table>
			</view>
			<p
				v-if="isPageEnd"
				class="flex justify-center co-999 p-6"
			>数据已全部加载!</p>
		</my-scroll>

		<view
			class="add"
			@click="handleAdd"
		>
			<u-icon
				name="plus-circle-fill"
				color="var(--color-primary)"
				:size="52"
			></u-icon>
		</view>
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
		getListItemLabel,
		RegistrationStatusList
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
		RegistrationStatus,
	} from "@/config/enums"
	import TagRegistrationStatus from "@/pagesComponents/tag-registration-status"
	import {
		registrationList
	} from "../../../api/registration";
	import {
		mapGetters
	} from "vuex"
	import {
		lineDetail,
		lineList
	} from '../../../api/line'

	export default {
		components: {
			TagRegistrationStatus,
		},
		computed: {
			...mapGetters(["userId", "isXianZhang", "manageLineId", "isEvent", "staffId"]),
			searchParams() {
				const {
					keyword,
					lineSelectValue,
					registrationStatusSelectValue
				} = this

				return {
					keyword,
					lineSelectValue,
					registrationStatusSelectValue
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
				RegistrationStatusList,

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

				registrationStatusSelectList: RegistrationStatusList,
				registrationStatusSelectValue: null,

			}
		},
		mounted(opts) {
			this.toGetNeedInfo()
		},
		methods: {

			// 生产登记新增
			handleAdd() {
				// 进入新增页
				uni.navigateTo({
					url: `/pages/registration-add/index`
				})
			},
			onScrollEnd() {
				console.log('end')
				this.toGetList(true)
			},

			/** 点击-表格订单 */
			handleDetailClick(record) {
				const {
					id,
					registrationStatus
				} = record

				// 进入详情页
				uni.navigateTo({
					url: `/pages/registration-detail/index?id=${id}`
				})

			},

			/** 请求必要信息 */
			async toGetNeedInfo() {
				await this.toGetLineSelectList()
				await this.toGetList()
			},

			handleResetParams() {
				this.keyword = ""
				this.registrationStatusSelectValue = null
				this.lineSelectValue = null
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
					// userId,
					registrationStatusSelectValue,
					lineSelectValue
				} = this

				const data = {
					pageNum,
					pageSize,
					sort,
					keyword,
					// userId,
					lineId: lineSelectValue,
					registrationStatus: registrationStatusSelectValue
				}

				this.loading = true

				const {
					records,
					total
				} = await registrationList(data)

				this.loading = false

				// 小程序内作用域插槽无法使用方法，对时间的渲染需要预先设置值
				records.forEach(i => {
					const [d1, d2] = i.startDate.split(" ")
					i.startDate1 = d1
					i.startDate2 = d2
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

	.add {
		position: fixed;
		bottom: 80px;
		right: 30px;
	}
</style>