<template>
	<view>
		<view class="avatar-panel flex flex-col justify-center">
			<view class="avatar mt-24 mb-18">
				<u-icon
					name="account-fill"
					color="#3c9cff"
					:size="42"
				></u-icon>
			</view>

			<view>
				<view class="form-item">
					<p>所属企业</p>
					<p>{{tenantInfo.tenantName}}</p>
				</view>
				<view class="form-item">
					<p>员工名称</p>
					<p class="flex">
						<span class="mr-4">
							{{userInfo.nickname}}
						</span>
						<u-tag
							size="mini"
							:text="isMain ? '主账号':staffTypeText"
							plain
							type="primary"
						></u-tag>
					</p>
				</view>
				<view class="form-item">
					<p>用户名</p>
					<p>{{userInfo.username}}</p>
				</view>
			</view>
		</view>

		<view class="mt-12">
			<u-cell-group>
				<u-cell
					:isLink="true"
					icon="setting-fill"
					title="工位绑定模组(可后台配置)"
					@click="go2StationBindModule"
				></u-cell>
				<u-cell
					:isLink="true"
					icon="setting-fill"
					title="网关绑定产线(可后台配置)"
					@click="go2GatewayBindStation"
				></u-cell>
			</u-cell-group>
		</view>

		<view class="p-24 mt-48">
			<u-button
				type="error"
				icon="arrow-leftward"
				text="退出"
				@click="handleLogout"
			/>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	export default {
		computed: {
			...mapGetters(["tenantInfo", "userInfo", "isMain", "staffTypeText"])
		},
		methods: {
			async handleLogout() {
				await this.$store.dispatch("logout")
				uni.reLaunch({
					url: "/pages/login/index"
				})
			},
			go2StationBindModule() {
				uni.navigateTo({
					url: "/pages/station-bind-module/index"
				})
			},
			go2GatewayBindStation() {
				uni.navigateTo({
					url: "/pages/gateway-bind-station/index"
				})
			},
		}

	}
</script>

<style
	lang="scss"
	scoped
>
	.avatar {
		width: px2rem(72);
		height: px2rem(72);
		border-radius: px2rem(9999);
		border: 1px solid var(--color-primary);
		@include center;
		@include simple-shadow;
		background-color: #f9f9f9;
	}

	.para {
		padding: px2rem(6) 0;
		font-size: $font-size;
		width: px2rem(220);
		white-space: nowrap;
		color: #999;
	}

	.form-item {
		>p:nth-child(1) {
			flex: 0 0 px2rem(90);
		}
	}
</style>