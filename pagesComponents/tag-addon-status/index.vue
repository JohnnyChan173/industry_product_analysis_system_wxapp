<template>
	<text
		v-if="addonInfo"
		class="square-btn"
		:class="getClass"
	>
		●{{ getText }}
	</text>
</template>

<script>
	import {
		getListItemLabel,
		AddonEventStatusList
	} from '../../config/data'
	import {
		AddonEventStatus
	} from '../../config/enums'

	export default {
		props: ["addonInfo"],
		computed: {
			getClass() {
				const s = this.addonInfo.eventStatus
				if (s === AddonEventStatus.READY) {
					return "warn"
				} else if (s === AddonEventStatus.PROCESSING) {
					return "primary"
				} else if (s === AddonEventStatus.PROCESSED) {
					return "success"
				} else if (s === AddonEventStatus.INVALID) {
					return ""
				}
			},
			getText() {
				const value = this.addonInfo.eventStatus
				return getListItemLabel(AddonEventStatusList, value)
			}
		},
	}
</script>

<style
	lang="scss"
	scoped
>
	.square-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 3px 6px;
		border-radius: 5px;
		box-sizing: border-box;
		border: 1px solid var(--color-secondary) !important;
		color: var(--color-secondary) !important;
		white-space: nowrap;
		&.warn {
			border-color: var(--color-warn) !important;
			color: var(--color-warn) !important;
		}
		&.success {
			border-color: var(--color-success) !important;
			color: var(--color-success) !important;
		}
		&.primary {
			border-color: var(--color-primary) !important;
			color: var(--color-primary) !important;
		}
	}
</style>