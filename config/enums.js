/** 生产任务单状态（0未开始；1 进行中；2已完成） */
export const ProductTaskStatus = {
	"NOT_DO": 0,
	"DOING": 1,
	"COMPLETE": 2,
}

/** 员工登记状态（-1 请假；0 未登记；1 登记中；2 登记结束） */
export const StaffSignStatus = {
	"ABSENT": -1,
	"NOT_DO": 0,
	"DOING": 1,
	"DONE": 2,
}

/** 员工类型（1 线长;2 普工;3 点检员；4事件管理员；5仓管）*/
export const StaffType = {
	"XIANZHANG": 1,
	"PUGONG": 2,
	"SPOTCHECK": 3,
	"EVENT": 4,
	"WAREHOUSE": 5
}

/** 产线登记状态（0 未生产；1 登记中；2 登记结束） */
export const RegistrationStatus = {
	"NOT_REGISTRATION": 0,
	"IN_REGISTRATION": 1,
	"END_REGISTRATION": 2,
}

/** 事件类型 */
export const AddonEventType = {
	"MATERIAL": 1,
	"DEVICE": 2,
	"QUALITY": 3,
	"OTHER": 4,
	"MULTIPLE": 6,
}

/** 事件状态（-1 无效事件；0 待接收；1处理中；2已处理） */
export const AddonEventStatus = {
	"INVALID": -1,
	"READY": 0,
	"PROCESSING": 1,
	"PROCESSED": 2,
}