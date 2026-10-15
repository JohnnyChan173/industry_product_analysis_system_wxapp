import {
	StaffSignStatus
} from "./enums";

/** 获取产品名称文案 */
export function getProductWholeText(productInfo, productAttrValueList) {
	let productText = ""
	let productAttrValueText = ""
	if (productInfo) {
		productText = productInfo.productName
	}

	if (productAttrValueList && productAttrValueList.length) {
		productAttrValueText = productAttrValueList.map(i => i.attrValue).join(";")
	}

	if (productAttrValueText) {
		return `${productText} / ${productAttrValueText}`
	} else {
		return `${productText}`
	}

}

/** 获取员工登记比率文案 */
export function getStaffSignedRatio(staffSignList = []) {
	const total = staffSignList.length;
	const signedTotal = staffSignList.filter((i) => i.signStatus > StaffSignStatus.NOT_DO).length
	return `${signedTotal} / ${total}`;
}

/** 通过id获取员工 */
export function getStaffInfoFromList(staffList = [], staffId) {
	if (staffList.length) {
		return staffList.find(i => i.id === staffId)
	}
}