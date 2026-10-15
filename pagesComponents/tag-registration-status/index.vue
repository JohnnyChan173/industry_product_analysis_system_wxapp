<template>
	<text
		v-if="registrationInfo"
		:class="getClass"
	>
		●{{ getText }}
	</text>
</template>

<script>
	import {
		getListItemLabel,
		RegistrationStatusList
	} from '../../config/data'
	import {
		RegistrationStatus
	} from '../../config/enums'

	export default {
		props: ["registrationInfo"],
		computed: {
			getClass() {
				const s = this.registrationInfo.registrationStatus
				if (s === RegistrationStatus.NOT_REGISTRATION) {
					return ""
				} else if (s === RegistrationStatus.IN_REGISTRATION) {
					return "co-pr"
				} else if (s === RegistrationStatus.END_REGISTRATION) {
					return "co-su"
				}
			},
			getText() {
				const value = this.registrationInfo.registrationStatus
				return getListItemLabel(RegistrationStatusList, value)
			}

		},

	}
</script>

<style>
</style>