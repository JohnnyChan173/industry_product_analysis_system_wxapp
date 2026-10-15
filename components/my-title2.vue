<template>
	<div
		class="title"
		:style="customStyle"
	>
		<view class="text">
			<div class="prefix"></div>
			<span class="subTitle">
				<slot>
					{{ title }}
				</slot>
			</span>
		</view>
		<span>
			<slot name="right"></slot>
		</span>
	</div>
</template>

<script>
	export default {
		externalClasses: ['my-class'],
		props: {
			customStyle: {
				type: [String, Object]
			},
			title: {
				type: String
			},
		}

	}
</script>

<style
	lang="scss"
	scoped
>
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: $font-size-s;
		color: #999;
		border-bottom: 1px solid #ccc;
		/* padding: px2rem(6) 0; */
		margin: 0 px2rem(16);
	}
	.text {
		display: flex;
		align-items: center;
	}

	.prefix {
		vertical-align: middle;
		border-radius: 0;
		width: px2rem(4);
		height: px2rem(15);
		border: px2rem(1) solid transparent;
		margin-right: px2rem(6);
		background: var(--color-primary);
	}

	.subTitle {
		font-weight: bold;
		color: #333;
		font-size: px2rem(13);
	}

	.prefix-circle {}
</style>
