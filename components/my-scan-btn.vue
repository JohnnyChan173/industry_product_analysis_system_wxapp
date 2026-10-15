<template>
	<view
		class="scan"
		@click="handleClick"
	>
		<u-icon
			name="scan"
			color="var(--color-primary)"
			:size="size"
		></u-icon>
	</view>
</template>

<script>
	export default {
		props: {
			size: {
				type: [String, Number],
				default: 32
			}
		},
		methods: {
			handleClick() {
				this.$emit("click")
			}

		}
	}
</script>

<style
	lang="scss"
	scoped
>
	.scan {
		display: inline-block;
		border-radius: 5px;
		border: 1px solid var(--color-primary);
		background: #F4FAFF;
	}
</style>