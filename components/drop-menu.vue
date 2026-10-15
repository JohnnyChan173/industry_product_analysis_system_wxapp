<template>
	<view
		class="select-box"
		v-show="show"
	>
		<!-- 关闭按钮 -->
		<view
			v-if="closeable"
			class="select-box-close"
			@click="handleClose"
		>
			<u-icon
				name="close-circle"
				size="20"
			></u-icon>
		</view>

		<view v-if="list && list.length">
			<view
				class="select-box-item"
				:class="activeIndex === index && 'active'"
				:style="{fontSize: fontSize + 'px'}"
				v-for="(item, index) in list"
				:key="index"
				@click.stop="handleSelect(item,index)"
			>
				<slot v-bind:item="item">
					{{item}}
				</slot>
			</view>
		</view>

		<view
			v-else
			class="text-secondary"
		>暂无结果</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			list: {
				type: Array,
				default: () => []
			},
			fontSize: {
				type: [Number, String],
				default: 14
			},
			closeable: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			list() {
				this.activeIndex = ""
			}
		},
		data() {
			return {
				activeIndex: ""
			}
		},
		methods: {
			handleSelect(item, index) {
				this.activeIndex = index
				this.$emit("select", item)
			},
			handleClose() {
				this.activeIndex = ""
				this.$emit("update:show", false)
			}
		}
	}
</script>

<style
	lang="scss"
	scoped
>
	.select-box {
		position: absolute;
		z-index: 9;
		top: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 4px 12px;
		background: #fff;
		border: 1px solid #ccc;
		@include simple-shadow;
		overflow-y: scroll;
		max-height: 30vh;

		&-item {
			color: #999;
			padding: 6px 0;
			font-size: 14px;

			&.active {
				color: var(--color-primary);
				font-weight: bold;
			}

			&:not(:last-child) {
				border-bottom: 1px solid #ccc;
			}
		}

		&-close {
			position: absolute;
			right: 3px;
			top: 3px
		}
	}
</style>