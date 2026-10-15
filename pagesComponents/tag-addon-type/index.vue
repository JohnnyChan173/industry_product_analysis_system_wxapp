<template>
	<span class="co-wa">
		{{ getText }}
	</span>
</template>

<script>
	import {
		getListItemLabel,
		AddonEventTypeList
	} from '../../config/data'
	import {
		AddonEventType
	} from '../../config/enums'

	export default {
		props: ["addonInfo"],
		computed:{
			getText() {
				const value = this.addonInfo.eventType
				return getListItemLabel(AddonEventTypeList, value)
			}
		},
	}
</script>

<style
	lang="scss"
	scoped
>

</style>