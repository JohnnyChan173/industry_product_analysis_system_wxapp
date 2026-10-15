<template>
	<view class="title flex">
		<slot>
			{{title}}
		</slot>
	</view>
</template>

<script>
	export default {
		externalClasses: ['my-class'],
		props: {
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
		font-size: $font-size-s;
		color: #999;
		border-bottom: 1px solid #ccc;
		padding: px2rem(6) 0;
	}
</style>
