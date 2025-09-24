<template>
	<view class="login-container">
		<!-- 顶部logo -->
		<view class="logo-box">
			<image src="https://img-hepingan.oss-cn-hangzhou.aliyuncs.com/page/a.jpg" mode="aspectFit" class="logo-img"></image>
			<text class="logo-title">欢迎登录</text>
		</view>
		
		<!-- 登录方式切换 -->
		<view class="login-tabs">
			<view class="tab-item" :class="{ active: loginType === 'wechat' }" @tap="switchLoginType('wechat')">
				<text class="tab-text">微信登录</text>
				<text class="tab-badge" v-if="loginType === 'wechat'">推荐</text>
			</view>
			<view class="tab-item" :class="{ active: loginType === 'password' }" @tap="switchLoginType('password')">
				<text class="tab-text">账密登录</text>
			</view>
		</view>
		
		<!-- 微信一键登录 -->
		<view class="wechat-login" v-if="loginType === 'wechat'">
			<button class="wechat-btn" @tap="handleWechatLogin">
				<text class="wechat-icon">📱</text>
				<text class="wechat-text">微信一键登录</text>
			</button>
			<view class="wechat-tips">
				<text class="tips-text">使用微信授权快速登录，安全便捷</text>
			</view>
		</view>
		
		<!-- 账密登录表单 -->
		<view class="login-form" v-if="loginType === 'password'">
			<view class="input-group">
				<text class="iconfont icon-user">👤</text>
				<input type="text" v-model="formData.username" placeholder="请输入用户名" />
			</view>
			
			<view class="input-group">
				<text class="iconfont icon-password">🔒</text>
				<input type="password" v-model="formData.password" placeholder="请输入密码" />
			</view>
			
			<button class="login-btn" @tap="handleLogin">登 录</button>
			
			<view class="options-box">
				<navigator url="/pages/login/register" class="register-link">注册账号</navigator>
				<text class="forget-pwd" @tap="handleForgetPassword">忘记密码？</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 登录方式：wechat-微信登录，password-账密登录
const loginType = ref('wechat')

const formData = ref({
	username: '',
	password: ''
})

// 切换登录方式
const switchLoginType = (type) => {
	loginType.value = type
}

// 微信一键登录
const handleWechatLogin = async () => {
	// #ifdef MP-WEIXIN

	const baseUrl = 'http://127.0.0.1:9090'

  //由于微信登录，需要获取code，所以需要使用微信官方的login接口
	uni.login({
		provider: 'weixin',
		success: (res) => {
			console.log(res.code)
			uni.request({
				url: `${baseUrl}/user/wx-login`,
				method: 'POST',
				data: res.code,
				success: (res) => {
					console.log(res)
					if(res.data.code === 200){
						uni.setStorageSync('sa-token', res.data.data.tokenValue)
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}, 1500)
					}else{
						uni.showToast({
							title: res.data.msg || '登录失败',
							icon: 'none'
						})
					}
				},
				fail: () => {
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					})
				}
			})
		},
		fail: () => {
			uni.showToast({
				title: '微信登录失败',
				icon: 'none'
			})
		}
	})
	// #endif
	
	// #ifndef MP-WEIXIN
	// 非微信小程序环境，显示提示
	uni.showToast({
		title: '请在微信小程序中使用',
		icon: 'none'
	})
	// #endif
}

// 账密登录
const handleLogin = () => {
	if (!formData.value.username || !formData.value.password) {
		uni.showToast({
			title: '请输入用户名和密码',
			icon: 'none'
		})
		return
	}
	
	// 这里替换为实际的登录接口
	uni.request({
		url: 'http://127.0.0.1:9090/user/login',
		method: 'POST',
		data: formData.value,
		success: (res) => {
			if (res.data.code === 200) {
				// 存储token
				console.log(res.data)
				uni.setStorageSync('sa-token', res.data.data.tokenValue)
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				// 跳转到首页
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 1500)
			} else {
				uni.showToast({
					title: res.data.msg || '登录失败',
					icon: 'none'
				})
			}
		},
		fail: () => {
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		}
	})
}

// 忘记密码
const handleForgetPassword = () => {
	uni.showToast({
		title: '请联系客服重置密码',
		icon: 'none'
	})
}
</script>

<style>
.login-container {
	padding: 60rpx 40rpx;
	min-height: 100vh;
	background-color: #F3F8EA;
}

.logo-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.logo-img {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 20rpx;
}

.logo-title {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
}

/* 登录方式切换标签 */
.login-tabs {
	display: flex;
	background-color: #f5f5f5;
	border-radius: 50rpx;
	padding: 8rpx;
	margin-bottom: 60rpx;
}

.tab-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx 0;
	border-radius: 42rpx;
	position: relative;
	transition: all 0.3s ease;
}

.tab-item.active {
	background-color: #ffffff;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.tab-text {
	font-size: 28rpx;
	color: #666;
	font-weight: 500;
}

.tab-item.active .tab-text {
	color: #007AFF;
	font-weight: bold;
}

.tab-badge {
	position: absolute;
	top: -8rpx;
	right: 20rpx;
	background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
	color: #fff;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-weight: bold;
}

/* 微信登录样式 */
.wechat-login {
	padding: 0 20rpx;
}

.wechat-btn {
	width: 100%;
	height: 100rpx;
	background: linear-gradient(135deg, #07c160, #00d4aa);
	color: #fff;
	font-size: 32rpx;
	border-radius: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 20rpx rgba(7, 193, 96, 0.3);
	transition: all 0.3s ease;
}

.wechat-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);
}

.wechat-icon {
	font-size: 40rpx;
	margin-right: 16rpx;
}

.wechat-text {
	font-weight: bold;
}

.wechat-tips {
	text-align: center;
	margin-top: 30rpx;
}

.tips-text {
	font-size: 24rpx;
	color: #999;
}

/* 账密登录表单 */
.login-form {
	padding: 0 20rpx;
}

.input-group {
	display: flex;
	align-items: center;
	padding: 24rpx 30rpx;
	background-color: #f8f8f8;
	border-radius: 40rpx;
	margin-bottom: 30rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s ease;
}

.input-group:focus-within {
	border-color: #007AFF;
	background-color: #f0f8ff;
}

.input-group .iconfont {
	font-size: 40rpx;
	color: #999;
	margin-right: 20rpx;
}

.input-group input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.input-group input::placeholder {
	color: #999;
}

.login-btn {
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background: linear-gradient(135deg, #007AFF, #5ac8fa);
	color: #fff;
	font-size: 32rpx;
	border-radius: 45rpx;
	margin-top: 60rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 122, 255, 0.3);
	transition: all 0.3s ease;
}

.login-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 3rpx 8rpx rgba(0, 122, 255, 0.3);
}

.options-box {
	display: flex;
	justify-content: space-between;
	margin-top: 30rpx;
	padding: 0 20rpx;
}

.register-link, .forget-pwd {
	font-size: 26rpx;
	color: #666;
	text-decoration: none;
}

.forget-pwd {
	cursor: pointer;
}

.register-link:active, .forget-pwd:active {
	color: #007AFF;
}
</style>
