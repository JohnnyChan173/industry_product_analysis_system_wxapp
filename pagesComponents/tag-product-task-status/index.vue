<template>
	<text
		:class="getClass"
	>
		●{{ getText }}
	</text>
</template>

<script>
	import {
		getListItemLabel,
		ProductTaskStatusList
	} from '../../config/data'
	import {
		ProductTaskStatus
	} from '../../config/enums'

	export default {
		props: ["value"],
		computed: {
			getClass() {
				const s = this.value
				if (s === ProductTaskStatus.NOT_DO) {
					return ""
				} else if (s === ProductTaskStatus.DOING) {
					return "co-pr"
				} else if (s === ProductTaskStatus.COMPLETE) {
					return "co-su"
				}
			},
			getText() {
				const value = this.value
				return getListItemLabel(ProductTaskStatusList, value)
			}

		},

	}
</script>

<style>
</style>