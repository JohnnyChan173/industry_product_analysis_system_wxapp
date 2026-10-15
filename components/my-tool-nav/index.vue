<template>
	<view class="mr-8">
		<view
			class="flex co-se"
			@click="handleNavClick"
		>
			<span :class="isSelectLabel && 'co-pr'">
				{{navLabel}}
			</span>
			<u-icon
				name="arrow-down-fill"
				size="14"
				color="#999"
			/>
		</view>

		<!-- 列表选择器 -->
		<u-picker
			:show="show"
			:columns="[computedList]"
			@cancel="handleNavCancel"
			@confirm="handleNavConfirm"
			keyName="label"
			:immediateChange="true"
		></u-picker>
	</view>
</template>

<script>
	import {
		instanceNextTick
	} from '../../utils/system'
	import {
		unshiftSelectItem
	} from '@/utils/index'
	export default {
		props: {
			list: {
				type: Array,
				default: () => []
			},
			value: {
				type: [Number, String],
				default: null
			},
			defaultLabel: {
				type: String,
				default: "全部"
			}
		},
		data() {
			return {
				show: false,
			}
		},
		computed: {
			isSelectLabel() {
				console.log(this.value)
				return this.value !== null
			},
			navLabel() {
				const {
					list,
					value,
					defaultLabel
				} = this

				const item = list.find(i => i.value === value)

				return item ? item.label : defaultLabel
			},
			computedList() {
				const l = this.list.slice()
				const ll = unshiftSelectItem(l, {
					label: "全部",
					value: null
				})
				return ll

			}
		},
		methods: {
			handleNavClick() {
				this.show = true
			},

			handleNavCancel() {
				this.show = false
			},

			async handleNavConfirm(e) {
				await instanceNextTick.call(this)
				const item = e.value[0]
				let {
					value,
					label
				} = item

				this.$emit('update:value', value)
				this.$emit('confirm', item)

				this.show = false
			},
		}
	}
</script>

<style>
</style>