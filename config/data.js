import {
	AddonEventStatus,
	AddonEventType,
	ProductTaskStatus,
	RegistrationStatus,
	StaffSignStatus,
	StaffType
} from "./enums";

/** 获取列表项文本 */
export function getListItemLabel(list, value) {
	console.log(list, value)
	const item = list.find((i) => i.value === value);
	return item ? item.label : "";
}

/** 生产任务单状态列表（0未开始；1 进行中；2已完成） */
export const ProductTaskStatusList = [
  {
    label: "未开始",
    value: ProductTaskStatus.NOT_DO,
  },
  {
    label: "进行中",
    value: ProductTaskStatus.DOING,
  },
  {
    label: "已完成",
    value: ProductTaskStatus.COMPLETE,
  },
];

/** 员工类型列表 */
export const StaffTypeList = [
  {
    label: "线长",
    value: StaffType.XIANZHANG,
  },
  {
    label: "普工",
    value: StaffType.PUGONG,
  },
  {
    label: "点检员",
    value: StaffType.SPOTCHECK,
  },
  {
    label: "事件管理员",
    value: StaffType.EVENT,
  },
];

/** 事件类型列表 */
export const AddonEventTypeList = [{
		label: "物料",
		value: AddonEventType.MATERIAL,
	},
	{
		label: "设备",
		value: AddonEventType.DEVICE,
	},
	{
		label: "品质",
		value: AddonEventType.QUALITY,
	},
	{
		label: "其他",
		value: AddonEventType.OTHER,
	},
	{
		label: "多能工",
		value: AddonEventType.MULTIPLE,
	},
];

/** 事件状态列表 */
export const AddonEventStatusList = [{
		label: "无效事件",
		value: AddonEventStatus.INVALID,
	},
	{
		label: "待接收",
		value: AddonEventStatus.READY,
	},
	{
		label: "处理中",
		value: AddonEventStatus.PROCESSING,
	},
	{
		label: "已处理",
		value: AddonEventStatus.PROCESSED,
	},
];


/** 登记状态（0 未生产；1 登记中；2 登记结束） */
export const RegistrationStatusList = [{
		label: "未登记",
		value: RegistrationStatus.NOT_REGISTRATION,
	},
	{
		label: "登记中",
		value: RegistrationStatus.IN_REGISTRATION,
	},
	{
		label: "登记结束",
		value: RegistrationStatus.END_REGISTRATION,
	},
];

/** 员工登记状态列表（-1 请假；0 未登记；1 登记中；2 登记结束） */
export const StaffSignStatusList = [{
		label: "请假",
		value: StaffSignStatus.ABSENT,
	},
	{
		label: "未登记",
		value: StaffSignStatus.NOT_DO,
	},
	{
		label: "登记中",
		value: StaffSignStatus.DOING,
	},
	{
		label: "登记结束",
		value: StaffSignStatus.DONE,
	},
];