<template>
	<page-meta :root-font-size="getRootFontSize()"> </page-meta>
	<view
		class="content"
		@click="handleGlobalClick"
	>
		<view class="logo flex justify-center">
			<view class="relative align-center">
				<image
					:style="{
						width: px2rem(60),
						height: px2rem(60),
					}"
					mode="aspectFit"
					src="/static/logo.png"
				/>
				<p class="logo-subTitle mt-6">可信数改普及版终端</p>
				<p class="logo-thirdTitle mt-6">-操作终端</p>
			</view>
		</view>

		<view class="form px-32 py-16">
			<!-- 	<p
				class="form-toggle align-right underline mb-12"
				co-pr
				@click="handleToggle"
			>切换手机号登录</p> -->

			<template v-if="isLoginMode">
				<view class="py-8 relative">
					<u-input
						v-model="account"
						placeholder="请输入用户名"
						border="bottom"
						clearable
						@click.native.stop="handleAccountClick"
					></u-input>
					<view
						class="select-box"
						v-if="locationAccountsShow && locationAccounts.length"
					>
						<view
							class="select-box-item"
							v-for="(item, index) in locationAccounts"
							:key="index"
							@click.stop="handleLocationAccount(item)"
						>
							{{ item }}
						</view>
					</view>
				</view>
				<view class="py-8">
					<u-input
						v-model="password"
						type="password"
						placeholder="请输入密码"
						border="bottom"
						clearable
					></u-input>
				</view>
			</template>

			<template v-else>
				<view class="py-8">
					<u-input
						v-model="phone"
						placeholder="请输入手机号"
						border="bottom"
						clearable
					>
						<template slot="suffix">
							<u-code
								ref="uCode"
								@change="codeChange"
								seconds="30"
								changeText="X秒重新获取"
							></u-code>
							<u-button
								@tap="getCode"
								:text="tips"
								type="primary"
								size="mini"
							></u-button>
						</template>
					</u-input>
				</view>
				<view class="py-8">
					<u-input
						v-model="verifyCode"
						placeholder="请输入验证码"
						border="bottom"
						clearable
					></u-input>
				</view>
			</template>

		</view>

		<view class="co-se font-size-ss align-right mx-32 mt-16">账号注册、密码找回请前往后台操作</view>

		<view class="btn mx-32 mt-12">
			<u-button
				type="primary"
				text="登录"
				@click="handleLogin"
			></u-button>
		</view>

		<!-- 弹窗 - toast-->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		smsSupplierLogin
	} from "@/api/sms.js"
	import {
		checkPhone,
		validReg
	} from "../../utils/validate"

	import {
		uniToast
	} from "@/utils/toast.js"
	import {
		getCurrentPageName
	} from "../../utils/native"
	import {
		checkLogin
	} from "../../utils/checkLogin"
	import storage from "../../utils/storage"

	export default {
		data() {
			return {
				loginMode: 0, // 0 用户名, 1手机号
				tips: "",

				account: "",
				password: "",
				
				account: "nbdzhxz001",
				password: "",

				phone: "",
				verifyCode: "",

				// 是否显示账号弹窗
				locationAccountsShow: false,
				// 本地存储数据
				locationAccounts: [],
			}
		},
		computed: {
			isLoginMode() {
				return this.loginMode === 0
			},
			isMobileMode() {
				return this.loginMode === 1
			},
		},
		async onLoad() {
			// 如果存在 token 则进行检测
			const token = storage.getToken()
			if (token) {
				await checkLogin()
			} else {
				this.getLatestAccount();
				this.getLocationAccounts();
			}

		},
		methods: {
			handleAccountClick() {
				this.locationAccountsShow = true;
			},

			handleLocationAccount(account) {
				this.account = account;
				this.locationAccountsShow = false;
			},

			// 全局点击事件 冒泡
			handleGlobalClick() {
				console.log('gloabl 冒泡到了');
				this.locationAccountsShow = false;
			},
			// 获取本地最新账号
			async getLatestAccount() {
				const account = await storage._get('account');
				this.account = account
			},

			// 获取本地账号集
			async getLocationAccounts() {
				const accounts = await storage._get('accounts');
				if (accounts.length) {
					this.locationAccounts = accounts;
				}
			},
			/** 切换登录模式 */
			handleToggle() {
				if (this.loginMode === 0) {
					this.account = ""
					this.password = ""
					this.loginMode = 1
				} else {
					this.phone = ""
					this.verifyCode = ""
					this.loginMode = 0
				}
			},

			codeChange(text) {
				this.tips = text;
			},
			async getCode() {
				const uCodeRef = this.$refs.uCode
				const {
					phone
				} = this

				if (uCodeRef.canGetCode) {
					// 校验手机号
					if (!checkPhone(phone)) {
						uniToast("手机号格式不正确")
						return
					}

					// 发送验证码
					const rs = await smsSupplierLogin(phone)
					console.log(rs)

					uniToast("验证码已发送")
					// 通知验证码组件内部开始倒计时
					uCodeRef.start();
				}
			},
			async handleLogin() {

				const {
					phone,
					verifyCode,
					account,
					password
				} = this

				// 校验填写
				if (!phone && !account) {
					uniToast("请填写完整信息")
					return
				}

				await this.$store.dispatch("login", {
					phone,
					verifyCode,
					account,
					password
				})

				// 登录正常，跳转至主页
				uni.redirectTo({
					url: "/pages/home/index"
				})
			},

		}
	}
</script>

<style
	lang="scss"
	scoped
>
	.content {
		height: 100vh;
	}

	.logo {
		height: px2rem(240);

		&-subTitle {
			font-size: px2rem(22);
			color: #1480D0;
			letter-spacing: px2rem(1);
		}

		&-thirdTitle {
			text-align: right;
			font-size: px2rem(13);
			color: #999;
		}
	}

	.form {}

	.select-box {
		position: absolute;
		z-index: 9;
		top: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: px2rem(4) px2rem(12);
		background: #fff;
		border: 1px solid #ccc;
		@include simple-shadow;
		overflow-y: scroll;
		max-height: 30vh;

		&-item {
			color: #999;
			padding: px2rem(6) 0;
			font-size: px2rem(14);

			&:not(:last-child) {
				border-bottom: 1px solid #ccc;
			}
		}
	}
</style>
