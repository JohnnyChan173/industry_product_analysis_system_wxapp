<template>
	<scroll-view
		class="myScroll"
		:style="{height: curHeight}"
		:scroll-y="true"
		:scroll-with-animation="true"
		:scroll-top="scrollTop"
		@scrolltolower="onScrollEnd"
	>
		<slot />
	</scroll-view>
</template>

<script>
	import {
		systemInfo,
		effectHeight
	} from '../config'
	export default {
		externalClasses: ['my-class'],
		props: {
			height: {
				type: [String, Number],
				default: 0
			},
			hasNav: {
				type: [Boolean, String],
				default: false
			},
			hasTab: {
				type: [Boolean, String],
				default: false
			},
			minus: {
				type: Number,
				default: 0
			},
			scrollTop: {
				type: Number,
				default: 0
			},
		},
		computed: {
			curHeight() {
				const {
					hasNav,
					hasTab,
					height
				} = this

				if (height) {
					if (typeof height === "number") {
						return height + 'px'
					}
					return height
				}

				let curHeight = 'auto'

				const windowHeightPx = effectHeight + 'px'

				curHeight = `calc(${windowHeightPx} - ${this.minus}px)`
				console.log(curHeight)
				return curHeight
			}
		},

		methods: {
			onScrollEnd(e) {
				console.log(e)
				this.$emit("scrollToEnd")
			}
		}
	}
</script>

<style
	lang="scss"
	scoped
>
	.myScroll {
		height: calc(100vh);
		overflow-x: hidden;
		overflow-y: auto;
		box-sizing: border-box;
	}
</style>