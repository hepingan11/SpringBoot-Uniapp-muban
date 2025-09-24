<script >
	export default{
		onShow() {
			const token = uni.getStorageSync("sa-token")
			if(!token){
				uni.showToast({
					title: "未登录"
				})
				setTimeout(uni.navigateTo({
					url: '/pages/login/login'
				}),1500)
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 全局样式 */
	page {
		font-size: 28rpx;
		color: #333;
		background-color: #f8f8f8;
	}

	/* 去除默认边距 */
	view, text, navigator, input {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}

	/* flex布局工具类 */
	.flex {
		display: flex;
	}

	.flex-row {
		flex-direction: row;
	}

	.flex-col {
		flex-direction: column;
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.justify-center {
		justify-content: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	.align-center {
		align-items: center;
	}

	/* 常用间距类 */
	.mt-10 {
		margin-top: 10rpx;
	}

	.mb-10 {
		margin-bottom: 10rpx;
	}

	.ml-10 {
		margin-left: 10rpx;
	}

	.mr-10 {
		margin-right: 10rpx;
	}

	.p-20 {
		padding: 20rpx;
	}
</style>
