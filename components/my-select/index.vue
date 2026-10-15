<template>
	<view class="select">
		<!-- 非输入模式 -->
		<view
			v-if="mode===0"
			class="select-input"
			@click="handleTextClick"
		>
			<view class="select-input-main">
				<p
					v-if="selectItem"
					class="hasValue"
				>{{selectItem.label}}</p>
				<p
					v-else
					class="noValue"
				>{{placeholder}}</p>
			</view>
			<view class="select-input-icon">
				<u-icon
					name="arrow-down"
					color="#666"
					size="18"
				></u-icon>
			</view>
		</view>

		<!-- 输入模式 -->
		<u-input
			v-else
			clearable
			focus
			v-model="keyword"
			@change="handleInputChange"
			:placeholder="placeholder"
			suffixIcon="arrow-down"
			@blur="handleInputBlur"
		></u-input>

		<my-drop-menu
			v-if="show"
			:closeable="false"
			:show.sync="show"
			:list="renderOptions"
			@select="handleSelect"
		>
			<template v-slot="{item}">
				{{ item.label }}
			</template>
		</my-drop-menu>
	</view>
</template>

<script>
	import {
		instanceNextTick
	} from "@/utils/system.js"

	export default {
		props: {
			options: {
				type: Array,
				default: () => []
			},
			value: {
				type: [String, Number],
			},
			placeholder: {
				type: String,
				default: "请选择"
			}
		},
		computed: {
			selectItem() {
				const {
					value,
					options
				} = this

				if (value) {
					// 过滤项
					const item = this.options.find(i => i.value === value)
					return item
				}
			},
			renderOptions() {
				const {
					options,
					keyword
				} = this
				if (keyword) {
					const newOps = options.filter(i => i.label.includes(keyword))
					return newOps
				} else {
					return options
				}
			}
		},
		data() {
			return {
				mode: 0,
				show: false,
				keyword: ""
			}
		},
		methods: {
			closeDropMenu() {
				this.mode = 0
				this.show = false;
				this.keyword = ""
			},
			openDropMenu() {
				this.mode = 1
				this.show = true;
			},
			handleTextClick() {
				this.openDropMenu()
			},
			handleSelect(item) {
				console.log(item)
				this.$emit("update:value", item.value)
				this.$emit("change", item)
				this.closeDropMenu()
			},
			handleInputChange(v) {
				// 同步过滤
				this.$emit("search", v)
			},
			async handleInputBlur() {
				// 开设毫秒延迟，避免让 handleSelect先执行
				setTimeout(() => {
					this.closeDropMenu()
				}, 100)
			},

		}
	}
</script>

<style
	lang="scss"
	scoped
>
	.select {
		position: relative;
		width: 100%;

		&-input {

			padding: 6px 9px;
			border: 1px solid #ccc;
			border-radius: 4px;
			height: 38px;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			color: #ccc;

			&-main {
				flex: 1;

				.noValue {
					color: #aaa;
				}

				.hasValue {
					color: #333;
				}
			}

			&-icon {
				flex: 0 0 18px;
			}


		}
	}
</style>