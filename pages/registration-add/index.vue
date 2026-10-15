<template>
	<view class="detail">
		<!-- 生产登记 -->
		<view class="py-12 pt-16">
			<my-title2 title="生产登记创建" />
		</view>

		<!-- 表单项 -->
		<view class="px-16">
			<view
				class="cell"
				@click="handleScan"
			>
				<view class="cell-field required">
					登记产线:
				</view>
				<view class="cell-value pointer-events-none">
					<u-input
						:value="lineInfo.lineName"
						:customStyle="scanInputStyle"
						placeholder="扫描产线或任务单二维码"
						suffixIcon="scan"
						:suffixIconStyle="scanBtnIconStyle"
					></u-input>
				</view>

			</view>

			<view class="cell">
				<view class="cell-field">
					关联任务单:
				</view>
				<view class="cell-value">
					<my-select
						:options="productTaskOptions"
						:value.sync="formData.taskId"
						placeholder="扫描产线后,可选择任务单"
						@search="handleProductTaskSearch"
					></my-select>
				</view>
			</view>

			<view
				class="cell"
				style="margin-top: 3px;"
				v-if="selectTaskInfo"
			>
				<view class="cell-field">
				</view>

				<view class="co-999">
					<p class="pb-3">
						<span>生产产品：</span>
						<span>{{selectTaskInfo.productInfo.productName}}</span>
						<span>{{getProductWholeText(selectTaskInfo.productInfo,selectTaskInfo.productAttrValueList)}}</span>
					</p>
					<p>生产数量：{{selectTaskInfo.productNumber}}</p>
					<p>计划完成：{{selectTaskInfo.planCompleteDate.split(" ")[0]}}</p>
					<p class="co-pr">生产进度：{{selectTaskInfo.registrationActualProductNumber}} /
						{{selectTaskInfo.productNumber}}
					</p>
					<p>任务单状态：<tag-product-task-status :value="selectTaskInfo.taskStatus" /></p>
					<p class="">备注：{{selectTaskInfo.memo}}</p>
				</view>
			</view>

			<view class="cell">
				<view class="cell-field required">
					产品&工艺:
				</view>

				<view class="cell-value">
					<my-select
						:options="virtualLineOptions"
						:value.sync="virtualLineFlatUuid"
						placeholder="扫描产线后,可选择工艺"
						@update:value="handleVirtualFlatUuidChange"
					></my-select>
				</view>
			</view>

			<view class="cell">
				<view class="cell-field">
					计划生产:
				</view>

				<u-number-box
					buttonSize="32"
					iconStyle="font-size:12px;"
					min="0"
					v-model="formData.planProductNumber"
				/>
				<text class="co-999 pl-3">(选填,0即不限)</text>
			</view>

			<view class="cell">
				<view class="cell-field">
					工位登记:
				</view>

				<view class="flex">
					<view
						class="font-size-l"
						:class="isAllStationSigned ? 'co-pr':'co-wa'"
					>
						{{stationSignedList.length}} / {{staffSignList.length}}
					</view>
					<view
						class="flex co-pr ml-6"
						@click="handleStaffSignEdit"
					>
						<text class="underline">编辑</text>
						<u-icon
							name="setting"
							color="var(--color-primary)"
							size="18"
						></u-icon>
					</view>
				</view>
			</view>

			<view class="cell">
				<view class="cell-field">
					拍照存证:
				</view>

				<view class="flex">
					<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						:sizeType="['compressed']"
						name="1"
						multiple
						:maxCount="5"
					></u-upload>
				</view>
			</view>


			<view class="cell">
				<view class="cell-field">
					备注:
				</view>

				<u-input
					placeholder="选填"
					v-model="formData.memo"
				/>
			</view>

			<view class="flex px-28 mt-24">
				<u-button
					class="ml-6"
					type="primary"
					@click="handleSubmit"
				>
					<text class="font-size-l">开始生产</text>
				</u-button>
			</view>
		</view>

		<!-- 工位登记表格弹窗 -->
		<u-popup
			mode="center"
			customStyle="width: 95vw;height: 80vh;"
			:round="5"
			:closeOnClickOverlay="false"
			:show="staffSignTableModal.visible"
			@close="onStaffSignTableClose"
			closeable
		>
			<view class="p-6 pt-36">
				<my-table
					bordered
					:dataSource="staffSignList"
					:columns="columns"
					:font-size="13"
					style="height: 70vh;"
				>
					<template v-slot:bodyCell="{text, record, index, column}">
						<template v-if="column.key==='order'">
							<span class="text-secondary">
								{{index+1}}
							</span>
						</template>
						<template v-if="column.dataIndex==='staffName'">
							<view
								class="flex"
								@click="handleStaffChangingClick(record)"
							>
								{{record.staffName}}
								<u-icon
									name="edit-pen"
									color="var(--color-primary)"
									size="20"
								></u-icon>
							</view>
						</template>
						<template v-if="column.dataIndex==='virtualStationName'">
							{{record.virtualStationName}}
						</template>
						<template v-if="column.dataIndex==='signStatus'">
							<tag-staff-sign-status :staffSignInfo="record" />
						</template>
						<template v-if="column.dataIndex==='action'">
							<!-- {{record.staffName}} -->
							<!-- <span v-if="record.staffName">{{record.signStatus}}</span> -->

							<!-- 工位绑定员工 -->
							<view>
								<text
									v-if="record.signStatus===0"
									class="co-pr"
									@click="handleStaffSign(record)"
								>登记</text>
								<text
									v-else-if="record.signStatus===1"
									class="co-wa"
									@click="handleStaffSignCancel(record)"
								>取消</text>
							</view>

						</template>
					</template>
				</my-table>
				<view class="text-right">
					<view
						class="co-pr py-12"
						@click="handleOneTouchSign"
					>一键考勤</view>
				</view>
			</view>
		</u-popup>

		<!-- 更换员工弹窗 -->
		<u-popup
			mode="center"
			:round="5"
			:closeOnClickOverlay="true"
			:show="staffChangingModal.visible"
			zIndex="10076"
			overlayStyle="z-index:10076"
			@close="onStaffChangingClose"
		>
			<view class="p-14 flex">
				<my-select
					style="width:150px"
					placeholder="请选择岗位员工"
					:options="staffChangingModal.options"
					:value.sync="staffChangingModal.staffId"
				></my-select>

				<view>
					<u-button
						type="primary"
						@click="handleChangingStaffSubmit"
					>确认</u-button>
				</view>
			</view>
		</u-popup>


	</view>
</template>

<script>
	import {
		virtualLineListByLineId
	} from '../../api/virtualLine'
	import {
		productTaskList as getProductTaskList,
		productTaskGetByTaskNo
	} from '../../api/productTask'
	import {
		debounce,
		debounceDelay,
		delay,
		formatTime,
		randomId,
		throwError
	} from '../../utils'
	import {
		columns
	} from "./table.js"
	import {
		staffListAll
	} from '../../api/staff'
	import {
		RegistrationStatus,
		StaffSignStatus,
		StaffType
	} from '../../config/enums'
	import TagStaffSignStatus from "@/pagesComponents/tag-staff-sign-status/index.vue"
	import {
		getStaffInfoFromList
	} from '../../config/parse'
	import {
		registrationAdd,
		registrationGetByLatest,
		registrationStaffSign,
		registrationStart
	} from '../../api/registration'
	import {
		errorToast,
		infoToast,
		successToast,
		uniToast
	} from '../../utils/toast'
	import {
		getValueByScanQrcode,
		getLineInfoByScan
	} from '../../core/scan'
	import {
		lineGetByUuid
	} from '../../api/line'
	import {
		getProductWholeText
	} from "../../config/parse"
	import TagProductTaskStatus from "@/pagesComponents/tag-product-task-status/index.vue"
	import {
		AUTHORIZATION_HEADER,
		env
	} from '../../config/request'
	import storage from '../../utils/storage'
	import {
		getOssFilePath
	} from '../../config/format'

	export default {
		components: {
			TagStaffSignStatus,
			TagProductTaskStatus
		},
		computed: {
			StaffSignStatus() {
				return StaffSignStatus
			},
			selectTaskInfo() {
				const {
					productTaskList
				} = this

				const {
					taskId
				} = this.formData

				if (taskId) {
					return productTaskList.find(i => i.id === taskId)
				}
			},
			isAllStationSigned() {
				if (this.staffSignList.length) {
					return this.staffSignList.length === this.stationSignedList.length
				}
			},
			stationSignedList() {
				return this.staffSignList.filter(i => i.signStatus === StaffSignStatus.DOING)
			},
			productTaskOptions() {
				const {
					productTaskList
				} = this
				if (productTaskList.length) {
					return productTaskList.map(i => ({
						label: i.taskNo,
						value: i.id
					}))
				}
			},
			virtualLineOptions() {
				const {
					virtualLineList
				} = this

				if (virtualLineList.length) {
					const options = []
					// 二级扁平
					for (let i = 0; i < virtualLineList.length; i++) {
						const virtualLineInfo = virtualLineList[i]

						const {
							craftInfo
						} = virtualLineInfo

						const {
							craftProductList
						} = craftInfo

						for (let j = 0; j < craftProductList.length; j++) {
							const productInfo = craftProductList[j]
							const data = {
								label: `${productInfo.productName}【${craftInfo.craftName}】`,
								value: randomId(),
								virtualLineId: virtualLineInfo.id,
								craftId: craftInfo.id,
								productId: productInfo.id,
								virtualLineInfo
							}
							options.push(data)
						}
					}

					return options
				}
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
				getProductWholeText,

				lineInfo: "",

				formData: {
					lineId: "",
					lineName: "",
					taskId: "",
					virtualLineId: "",
					productId: "",
					productAttrValueIdsList: [],
					craftId: "",
					planProductNumber: 0,
					memo: "",
					filePathList: []
				},

				fileList1: [],

				staffList: [],

				productTaskList: [],

				virtualLineList: [],
				virtualLineFlatUuid: "",

				columns,
				staffSignList: [],

				staffChangingModal: {
					visible: false,
					options: [],
					virtualStationId: 0,
					staffId: 0
				},

				staffSignTableModal: {
					visible: false
				}
			}
		},
		onLoad(opts) {
			// const {
			// 	lineId,
			// 	lineName,
			// 	taskId,
			// 	productId
			// } = opts

			// this.formData.lineId = Number(lineId) || null
			// this.formData.lineName = lineName
			// this.formData.taskId = Number(taskId) || null
			// this.formData.productId = Number(productId) || null

			// 直接唤起扫码
			this.handleScan();
		},
		mounted() {
			this.toGetNeedInfo();
		},
		methods: {
			uploadFilePromise(url) {
				const {
					baseUploadUrl
				} = env

				console.log(url)

				return new Promise((resolve, reject) => {
					const authorizationHeader = "Bearer " + storage.getToken()

					let a = uni.uploadFile({
						url: baseUploadUrl, // 仅为示例，非真实的接口地址
						header: {
							[AUTHORIZATION_HEADER]: authorizationHeader
						},
						filePath: url,
						name: 'file',
						success: (res) => {
							let resData = res.data
							if (typeof resData === "string") {
								resData = JSON.parse(resData)
								resolve(resData.data)
							} else {
								errorToast("返回值错误: " + res)
								reject()
							}
						}
					});
				})
			},

			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: getOssFilePath(result),
						name: result
					}))
					fileListLen++
				}

				console.log(this.fileList1)
			},

			/** 扫描二维码 */
			async handleScan() {
				try {

					uni.showLoading({
						title: "加载中..."
					})
					
					// uni.scanCode({
					// 	onlyFromCamera: true,
					// 	scanType: ["barCode", "qrCode"],
					// 	success: (res) => {
					// 		const {
					// 			result
					// 		} = res
					// 		// resolve(result)
					// 	},
					// 	fail(res) {
					// 		// reject(res)
					// 	}
					// })
					
					const scanNo = await getValueByScanQrcode()
					
					// 尝试获取产线详情
					const lineInfo = await lineGetByUuid(scanNo)
					console.log(4,lineInfo)
					
					if (lineInfo) {
						this.toLineScan(lineInfo)
						return
					}
					// 尝试获取生产任务单详情
					const taskInfo = await productTaskGetByTaskNo(scanNo)
					console.log(5,taskInfo)
					
					if (taskInfo) {
						this.toProductTaskScan(taskInfo)
						return
					}
					throwError("产线或生产任务单不存在!")
				} catch (e) {
					errorToast(e)
					await delay(1000)
					uni.hideLoading()
				} finally {
					uni.hideLoading()
				}
			},

			/** 处理生产任务单二维码 */
			async toProductTaskScan(taskInfo) {
				const self = this

				const {
					id: taskId,
					taskNo,
					lineId,
					lineInfo,
					productId,
					productAttrValueIdsList,
					productNumber
				} = taskInfo

				const hasDoingReg = await this.checkLineHasDoingReg(lineId)
				console.log(3,hasDoingReg)
				
				// 如果是进行中 则提示
				if (hasDoingReg) {
					return;
				}

				// 如果非进行中，则基于产品，匹配唯一虚拟产线登记
				this.lineInfo = lineInfo
				this.formData.taskId = taskId
				this.formData.lineId = lineId
				this.formData.productId = productId
				this.formData.productAttrValueIdsList = productAttrValueIdsList
				this.formData.planProductNumber = productNumber
				await this.toGetProductTaskList(taskNo)
				await this.toGetVirtualLineList()
				await this.toSyncVirtualLineUuid()

			},

			/** 处理产线二维码 */
			async toLineScan(lineInfo) {
				const self = this

				const hasDoingReg = await this.checkLineHasDoingReg(lineInfo.id)
				console.log(2,hasDoingReg)
				if (hasDoingReg) {
					return;
				}

				this.lineInfo = lineInfo
				this.formData.lineId = lineInfo.id
				this.toGetProductTaskList()
				this.toGetVirtualLineList()

			},

			/** 检测产线是否存在登记 */
			async checkLineHasDoingReg(lineId) {
				// 获取产线最新生产登记信息
				const lineLatestRegInfo = await registrationGetByLatest(lineId)
				console.log(1,lineLatestRegInfo)
				if (lineLatestRegInfo) {
					const isDoing = lineLatestRegInfo.registrationStatus === RegistrationStatus.IN_REGISTRATION
					if (isDoing) {
						this.lineInfo = ""
						// 跳转详情页
						const id = lineLatestRegInfo.id
						// 进入详情页
						uni.navigateTo({
							url: `/pages/registration-detail/index?id=${id}`,
						})

						await delay(500)

						infoToast("扫描产线存在登记！请先结束")

						return lineLatestRegInfo
					}
				}
			},

			/** 一键考勤 */
			handleOneTouchSign() {
				// 对签到表有 staffId的实行登记
				this.staffSignList.forEach(i => {
					// if (i.staffId) {
					i.signStatus = StaffSignStatus.DOING
					// }
				})
			},

			/** 工位登记弹窗关闭 */
			onStaffSignTableClose() {
				this.staffSignTableModal.visible = false
			},
			/** 工位登记弹窗编辑 */
			handleStaffSignEdit() {
				this.staffSignTableModal.visible = true
			},
			/** 员工登记 */
			handleStaffSign(record) {
				/* console.log(record)
				record.signStatus = StaffSignStatus.DOING */

				const {
					staffId
				} = record

				// 对签到表有 staffId的实行登记
				const item = this.staffSignList.find(i => i.staffId === staffId)

				if (item) {
					item.signStatus = StaffSignStatus.DOING
				}

			},
			/** 员工登记取消 */
			handleStaffSignCancel(record) {
				// console.log(record)
				// record.signStatus = StaffSignStatus.NOT_DO

				const {
					staffId
				} = record

				// 对签到表有 staffId的实行登记
				const item = this.staffSignList.find(i => i.staffId === staffId)

				if (item) {
					item.signStatus = StaffSignStatus.NOT_DO
				}
			},
			/** 员工变更关闭 */
			onStaffChangingClose() {
				this.staffChangingModal.visible = false
			},
			/** 员工变更-确认*/
			handleChangingStaffSubmit() {
				const {
					staffId,
					virtualStationId
				} = this.staffChangingModal

				console.log(staffId,
					virtualStationId)

				// 找到考勤数据
				const staffSignInfo = this.staffSignList.find(i => i.virtualStationId === virtualStationId)
				// 变更考勤员工
				staffSignInfo.staffId = staffId
				staffSignInfo.staffName = getStaffInfoFromList(this.staffList, staffId).staffName
				this.staffChangingModal.visible = false
			},
			/** 员工变更 */
			handleStaffChangingClick(record) {
				const {
					staffList,
					staffSignList
				} = this

				// 先过滤掉已被登记的员工
				const unSignedStaffList = staffList.filter(i => !(staffSignList.find(j => j.staffId === i.id)))

				console.log({
					staffList,
					staffSignList,
					unSignedStaffList
				})

				this.staffChangingModal.options = unSignedStaffList.map(i => ({
					label: i.staffName,
					value: i.id,
				}))

				this.staffChangingModal.virtualStationId = record.virtualStationId
				this.staffChangingModal.staffId = record.staffId
				this.staffChangingModal.visible = true
				console.log(record)
			},

			/** 生成工位登记列表 */
			async generateStaffSignList(virtualLineInfo) {
				console.log(virtualLineInfo)
				// 注入相关字段
				const {
					virtualStationList,
				} = virtualLineInfo

				const {
					lineId,
					virtualLineId
				} = this.formData

				// 遍历虚拟工位列表, 生成工位登记表
				const staffSignList = []
				virtualStationList.forEach(virtualStationInfo => {
					const {
						stationInfo
					} = virtualStationInfo

					const staffInfo = this.staffList.find(j => j.id === stationInfo.staffId)

					const data = {
						"staffName": staffInfo ? staffInfo.staffName : "",
						"virtualStationName": virtualStationInfo.virtualStationName,
						"startDate": formatTime(),
						"endDate": "",
						"signStatus": StaffSignStatus.NOT_DO,
						"absentMemo": "",
						"productRegistrationId": undefined,
						"lineId": lineId,
						"virtualLineId": virtualLineId,
						"stationId": stationInfo.id,
						"virtualStationId": virtualStationInfo.id,
						"staffId": staffInfo ? staffInfo.id : ""
					}
					staffSignList.push(data)
				})
				console.log(staffSignList)
				this.staffSignList = staffSignList
			},

			/** 重新扫描 */
			async handleScanClick() {
				// 扫码
				const lineInfo = await getLineInfoByScan();
				const {
					id: lineId,
					lineName
				} = lineInfo
				uni.redirectTo({
					url: `/pages/registration-add/index?lineId=${lineId}&lineName=${lineName}`
				})

			},

			async submit() {
				uni.showLoading({
					title: "处理中..."
				})
				// 先创建登记
				const data = this.formData
				// 注入图片数据
				data.filePathList = this.fileList1.map(i => i.name)
				console.log(data,'==========================')
				
				const registrationId = await registrationAdd(data)
				console.log(registrationId,"========================")
				// 再执行员工登记 （过滤有登记的数据）
				const data2 = this.staffSignList

				// 注入 registrationId
				data2.forEach(i => i.productRegistrationId = registrationId)
				await registrationStaffSign(data2)

				// 开始生产
				const newRegId = await registrationStart(registrationId)

				uni.hideLoading()

				successToast("操作成功")
				await delay(500);

				uni.redirectTo({
					url: `/pages/registration-detail/index?id=${newRegId}`
				})
			},

			/** 开始生产 */
			async handleSubmit() {

				// 简单校验
				const {
					lineId,
					productId,
					virtualLineId
				} = this.formData

				const {
					staffSignList,
					isAllStationSigned
				} = this

				if (!lineId) {
					infoToast("未扫描产线或任务单")
					return
				}

				if (!productId || !virtualLineId) {
					infoToast("未选择产品&工艺")
					return
				}

				const self = this;
				if (!isAllStationSigned) {

					uni.showModal({
						title: `存在未登记工位！`,
						content: `未登记工位信号将无法上报`,
						confirmText: "确认",
						async success(res) {
							if (res.confirm) {
								self.submit()
							}
						}
					})

				} else {
					this.submit()
				}

			},

			/** 虚拟产线扁平选择变化 */
			handleVirtualFlatUuidChange(value) {

				const {
					virtualLineOptions
				} = this
				const item = virtualLineOptions.find(i => i.value === value)

				// 同步id
				this.formData.productId = item.productId
				this.formData.craftId = item.craftId
				this.formData.virtualLineId = item.virtualLineId

				// 生成工位登记列表
				this.generateStaffSignList(item.virtualLineInfo);

				// 自动执行全选
				this.handleOneTouchSign()
			},

			// 关联任务单-逻辑
			handleProductTaskSearch: debounce(async function(value) {
				console.log(value)
				await this.toGetProductTaskList(value);
			}, debounceDelay),

			async toGetProductTaskList(keyword) {
				const {
					lineId
				} = this.formData

				const rs = await getProductTaskList({
					pageNum: 1,
					pageSize: 10,
					sort: "id desc",
					lineId,
					keyword
				})

				const {
					records
				} = rs

				this.productTaskList = records
			},

			// 虚拟产线-逻辑
			async toGetVirtualLineList(keyword) {
				const records = await virtualLineListByLineId(this.formData.lineId)
				this.virtualLineList = records

				// 如果虚拟产线就一条直接赋值
				const vOpts = this.virtualLineOptions
				if (vOpts.length === 1) {
					const value = vOpts[0].value
					this.virtualLineFlatUuid = value
					this.handleVirtualFlatUuidChange(value)
				}
			},

			/** 获取全部员工-普工 */
			async toGetAllStaffPuGongList() {
				const records = await staffListAll({
					staffType: StaffType.PUGONG
				})

				this.staffList = records
			},

			/** 同步虚拟产线uuid */
			toSyncVirtualLineUuid() {
				// 通过产品id 找到虚拟产线
				const {
					virtualLineOptions
				} = this

				const {
					productId
				} = this.formData

				for (let i = 0; i < virtualLineOptions.length; i++) {
					const {
						virtualLineInfo,
						value
					} = virtualLineOptions[i]

					const {
						craftInfo: {
							craftProductList
						}
					} = virtualLineInfo

					const findProduct = craftProductList.find(i => i.id === productId)
					if (findProduct) {
						console.log(value)
						this.virtualLineFlatUuid = value
						this.handleVirtualFlatUuidChange(value)
						break;
					}
				}

			},

			async toGetNeedInfo() {
				// 获取生产任务单列表
				// await this.toGetProductTaskList();
				// 获取全部员工
				await this.toGetAllStaffPuGongList()

			}
		}
	}
</script>

<style
	lang="scss"
	scoped
>
	::v-deep {
		&.detail {
			padding-bottom: 45px;

			.cell {
				margin-top: 16px;
			}

			.cell-field {
				flex: 0 0 100px;
			}
		}
	}
</style>