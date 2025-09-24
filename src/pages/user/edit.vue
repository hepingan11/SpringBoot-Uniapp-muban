<template>
	<view class="edit-container">
		<!-- 头部导航 -->
		<view class="header">
			<view class="header-left" @tap="goBack">
				<text class="back-icon">←</text>
			</view>
			<text class="header-title">编辑资料</text>
			<view class="header-right" @tap="saveUserInfo">
				<text class="save-text">保存</text>
			</view>
		</view>

		<!-- 头像编辑区域 -->
		<view class="avatar-section">
			<view class="avatar-container" @tap="chooseAvatar">
				<image :src="userInfo.avatar" class="user-avatar" v-if="userInfo.avatar"></image>
				<view class="avatar-placeholder" v-else>
					<text class="avatar-text">点击上传头像</text>
				</view>
				<view class="avatar-edit-icon">
					<text class="edit-icon">📷</text>
				</view>
			</view>
			<text class="avatar-tip">点击更换头像</text>
		</view>

		<!-- 用户信息表单 -->
		<view class="form-section">
			<view class="form-item">
				<text class="form-label">用户名</text>
				<input 
					type="text" 
					v-model="userInfo.username" 
					placeholder="请输入用户名" 
					class="form-input"
					maxlength="20"
				/>
			</view>
			
			<view class="form-item">
				<text class="form-label">手机号</text>
				<input 
					type="text" 
					v-model="userInfo.phone" 
					placeholder="请输入手机号" 
					class="form-input"
					maxlength="11"
				/>
			</view>
			
			<view class="form-item">
				<text class="form-label">邮箱</text>
				<input 
					type="text" 
					v-model="userInfo.email" 
					placeholder="请输入邮箱" 
					class="form-input"
				/>
			</view>
			
			<view class="form-item">
				<text class="form-label">个人简介</text>
				<textarea 
					v-model="userInfo.bio" 
					placeholder="请输入个人简介" 
					class="form-textarea"
					maxlength="100"
				></textarea>
			</view>
		</view>

		<!-- 加载状态 -->
		<view class="loading-overlay" v-if="loading">
			<view class="loading-spinner"></view>
			<text class="loading-text">保存中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

// 用户信息
const userInfo = ref({
	username: '',
	avatar: '',
	phone: '',
	email: '',
	bio: '',
	role: ''
})

// 加载状态
const loading = ref(false)

// 获取用户信息
const getUserInfo = async () => {
	try {
		loading.value = true
		const response = await request('/user/info', {
			method: 'GET'
		})
		
		if (response.code === 200) {
			userInfo.value = {
				username: response.data.username || '',
				avatar: response.data.avatar || '',
				phone: response.data.phone || '',
				email: response.data.email || '',
				bio: response.data.bio || '',
				role: response.data.role || ''
			}
		} else {
			uni.showToast({
				title: response.msg || '获取用户信息失败',
				icon: 'none'
			})
		}
	} catch (error) {
		console.error('获取用户信息失败:', error)
		uni.showToast({
			title: '网络错误，请重试',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 选择头像
const chooseAvatar = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0]
			uploadAvatar(tempFilePath)
		},
		fail: () => {
			uni.showToast({
				title: '选择图片失败',
				icon: 'none'
			})
		}
	})
}

// 上传头像
const uploadAvatar = async (filePath) => {
	try {
		loading.value = true
		
		// 使用uni.uploadFile上传文件
		const uploadResult = await new Promise((resolve, reject) => {
			uni.uploadFile({
				url: 'http://127.0.0.1:9090/user/updateAvatar',
				filePath: filePath,
				name: 'file',
				header: {
					'sa-token': uni.getStorageSync('sa-token')
				},
				success: (res) => {
					try {
						const data = JSON.parse(res.data)
						resolve(data)
					} catch (e) {
						reject(e)
					}
				},
				fail: reject
			})
		})
		
		if (uploadResult.code === 200) {
			userInfo.value.avatar = uploadResult.data
			uni.showToast({
				title: '头像上传成功',
				icon: 'success'
			})
		} else {
			uni.showToast({
				title: uploadResult.msg || '头像上传失败',
				icon: 'none'
			})
		}
	} catch (error) {
		console.error('头像上传失败:', error)
		uni.showToast({
			title: '头像上传失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 保存用户信息
const saveUserInfo = async () => {
	// 表单验证
	if (!userInfo.value.username.trim()) {
		uni.showToast({
			title: '请输入用户名',
			icon: 'none'
		})
		return
	}
	
	if (!userInfo.value.phone.trim()) {
		uni.showToast({
			title: '请输入手机号',
			icon: 'none'
		})
		return
	}
	
	// 手机号格式验证
	const phoneRegex = /^1[3-9]\d{9}$/
	if (!phoneRegex.test(userInfo.value.phone)) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		})
		return
	}
	
	// 邮箱格式验证（如果填写了邮箱）
	if (userInfo.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.value.email)) {
		uni.showToast({
			title: '请输入正确的邮箱格式',
			icon: 'none'
		})
		return
	}
	
	try {
		loading.value = true
		const response = await request('/user/update', {
			method: 'POST',
			data: {
				username: userInfo.value.username,
				phone: userInfo.value.phone,
				email: userInfo.value.email,
				bio: userInfo.value.bio
			}
		})
		
		if (response.code === 200) {
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		} else {
			uni.showToast({
				title: response.msg || '保存失败',
				icon: 'none'
			})
		}
	} catch (error) {
		console.error('保存用户信息失败:', error)
		uni.showToast({
			title: '网络错误，请重试',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 返回上一页
const goBack = () => {
	uni.navigateBack()
}

// 页面加载时获取用户信息
onMounted(() => {
	getUserInfo()
})
</script>

<style>
.edit-container {
	background-color: #F3F8EA;
	min-height: 100vh;
}

/* 头部导航 */
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #E5E5E5;
}

.header-left, .header-right {
	padding: 10rpx;
}

.back-icon {
	font-size: 36rpx;
	color: #333;
}

.header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.save-text {
	font-size: 28rpx;
	color: #45a048;
	font-weight: bold;
}

/* 头像编辑区域 */
.avatar-section {
	background-color: #fff;
	padding: 60rpx 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20rpx;
}

.avatar-container {
	position: relative;
	margin-bottom: 20rpx;
}

.user-avatar {
	width: 160rpx;
	height: 160rpx;
	border-radius: 80rpx;
}

.avatar-placeholder {
	width: 160rpx;
	height: 160rpx;
	border-radius: 80rpx;
	background-color: #F5F5F5;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx dashed #ccc;
}

.avatar-text {
	font-size: 24rpx;
	color: #999;
}

.avatar-edit-icon {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 50rpx;
	height: 50rpx;
	background-color: #45a048;
	border-radius: 25rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #fff;
}

.edit-icon {
	font-size: 24rpx;
	color: #fff;
}

.avatar-tip {
	font-size: 24rpx;
	color: #666;
}

/* 表单区域 */
.form-section {
	background-color: #fff;
	padding: 0 30rpx;
}

.form-item {
	padding: 40rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.form-item:last-child {
	border-bottom: none;
}

.form-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.form-input {
	width: 100%;
	font-size: 28rpx;
	color: #333;
	padding: 20rpx 0;
	border: none;
	outline: none;
}

.form-textarea {
	width: 100%;
	font-size: 28rpx;
	color: #333;
	padding: 20rpx 0;
	border: none;
	outline: none;
	min-height: 120rpx;
	resize: none;
}

/* 加载状态 */
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid #f3f3f3;
	border-top: 4rpx solid #45a048;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 20rpx;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 28rpx;
	color: #fff;
}
</style>
