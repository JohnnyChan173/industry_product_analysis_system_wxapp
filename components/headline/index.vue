<template>
	<view
		class="headline"
		:class="border&&'border'"
	>
		<!-- 左侧 -->
		<view class="flex items-center">
			<!-- 1、左插槽 -->
			<slot name="left">
			</slot>

			<!-- 2、内容 -->
			<view>
				<slot>
					{{title}}
				</slot>
			</view>
		</view>

		<!-- 3. 右插槽 -->
		<view>
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: "",
			},
			border: {
				type: [String, Boolean],
				default: ""
			},
		},
	}
</script>

<style
	lang="scss"
	scoped
>
	.headline {
		position: relative;
		display: flex;
		align-items: center;
		font-size: px2rem(14);
		color: #999;
		&.border {
			border-bottom: 1px solid #ccc;
		}
	}

</style>