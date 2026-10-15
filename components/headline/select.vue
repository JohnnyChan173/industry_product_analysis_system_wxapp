<template>
	<view>
		<!-- 头部 -->
		<my-headline :class="border &&'border'">
			<text class="color-secondary" :style="{fontSize: px2rem(14)}">
				{{title}}
			</text>

			<view
				v-if="showArrow"
				slot="right"
				class="arrow ml-3px"
				:class="expand &&'rotate'"
			>
				<u-icon
					name="arrow-down"
					color="#aaa"
					size="18"
				></u-icon>
			</view>
		</my-headline>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String
			},
			expand: {
				type: Boolean,
				default: false
			},
			showArrow: {
				type: Boolean,
				default: true
			},
			border: {
				type: [String, Boolean],
				default: ""
			},
		}

	}
</script>

<style
	lang="scss"
	scoped
>
	.border {
		border-bottom: 1px solid #ddd;
		padding-bottom: 4px;
	}

	.arrow {
		transition: all 300ms;

		&.rotate {
			transform: rotate(180deg);
		}

	}
</style>