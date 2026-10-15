<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	
	/* 引入样式集  */
	@import './styles/main-index.scss';

</style>

<script>
	import storage from "@/utils/storage.js";
	import {
		checkLogin
	} from "@/utils/checkLogin"
	
	export default {
		onLaunch: async function() {
			const loginId = this.$store.state.userId
			const token = storage.getToken()
			// 如果不存在 loginId token 则进行检测
			if (!loginId && token) {
				await checkLogin()
			}
		},
		onShow: function() {},
		onHide: function() {},
	}
</script>

<style lang="scss">
	/*公共css */
	$normal-pad: 14px;

	/*公共css */
	html,
	body {
		//overflow-x: hidden;
		//overflow-y: hidden;
		font-size: px2rem(14);

		.u-button {
			&.my-button {
				width: px2rem(90);
				// height: 32rpx!important;
			}
		}
	}

	.u-border {
		border-width: px2rem(1) !important;
		border-color: #ccc !important;
	}

	.u-input {
		background-color: #fff;
	}

	.uni-system-preview-image {
		z-index: 10080;
	}
</style>
