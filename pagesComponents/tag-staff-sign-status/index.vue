<template>
	<text
		v-if="staffSignInfo"
		:class="getClass"
	>
		●{{ getText }}
	</text>
</template>

<script>
	import {
		getListItemLabel,
		StaffSignStatusList
	} from '../../config/data'
	import {
		StaffSignStatus
	} from '../../config/enums'

	export default {
		props: ["staffSignInfo"],
		computed: {
			getClass() {
				const s = this.staffSignInfo.signStatus
				console.log(s)
				if (s === StaffSignStatus.NOT_DO) {
					return "co-999"
				} else if (s === StaffSignStatus.DOING) {
					return "co-pr"
				} else if (s === StaffSignStatus.DONE) {
					return "co-su"
				}else if (s === StaffSignStatus.ABSENT) {
					return "co-da"
				}
			},
			getText() {
				const value = this.staffSignInfo.signStatus
				return getListItemLabel(StaffSignStatusList, value)
			}

		},

	}
</script>

<style>
</style>