/** 正则类型 */
export const regType = {
	phone: {
		reg: /^1[3|4|5|7|8]\d{9}$/,
		message: "请输入正确格式的手机号",
	},
	email: {
		reg: /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/,
		message: "请输入正确格式的邮箱",
	},
	password: {
		reg: /.{4}/,
		message: "密码长度需大于4",
	},
	/** 是 number string */
	numberString: {
		reg: /^-?\d+$/,
		message: "请输入数字",
	},
	http: {
		reg: /^([hH][tT]{2}[pP]:\/\/)|([hH][tT]{2}[pP][sS]?:\/\/)/,
		message: "请输入正确格式的网址",
	},
};

/**
 * 检测手机号
 */
export function checkPhone(value) {
	const {
		reg,
		message
	} = regType.phone

	return reg.test(value)
}
