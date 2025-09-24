<template>
	<view class="user-container">
		

		<!-- 用户信息区域 -->
		<view class="user-profile">
			<view class="user-avatar-section">
				<image :src="userInfo.avatar" class="user-avatar"></image>
				<view class="user-info">
					<text class="user-name">{{ userInfo.username || '茶饮用户' }}</text>
					<view class="upgrade-btn" @tap="upgradeMember">
						<text class="upgrade-text">¥199 升级会员</text>
						<text class="upgrade-arrow">→</text>
					</view>
				</view>
			</view>
			<view class="edit-btn" @tap="editUserInfo">
				<image src="/static/icon/edit.png" class="edit-icon"></image>
			</view>
		</view>

		<!-- 会员状态卡片 -->
		<view class="membership-card" @tap="goToMembership">
			<view class="membership-icon">
				<text class="v-icon">V</text>
			</view>
			<view class="membership-info">
				<text class="membership-text">当前已有 {{ userStats.orderCount }} 订单 | {{ userStats.points }} 积分</text>
			</view>
			<text class="membership-arrow">→</text>
		</view>

		<!-- 快速访问功能 -->
		<view class="quick-access">
			<view class="quick-item" @tap="goToOrders">
				<image src="/static/icon/order.png" class="quick-icon"></image>
				<text class="quick-text">订单</text>
			</view>
			<view class="quick-item" @tap="goToReviews">
				<image src="/static/icon/评价.png" class="quick-icon"></image>
				<text class="quick-text">评价</text>
			</view>
			<view class="quick-item" @tap="goToCoupons">
				<image src="/static/icon/优惠券.png" class="quick-icon"></image>
				<text class="quick-text">优惠券</text>
			</view>
			<view class="quick-item" @tap="goToActivities">
				<image src="/static/icon/活动.png" class="quick-icon"></image>
				<text class="quick-text">活动</text>
			</view>
		</view>

		<!-- 管理员入口 -->
		<view class="admin-section" v-if="userInfo.role === 'ADMIN'">
			<view class="admin-card" @tap="goToAdmin">
				<view class="admin-icon">
					<text class="admin-text">⚙️</text>
				</view>
				<view class="admin-info">
					<text class="admin-title">管理员入口</text>
					<text class="admin-desc">系统管理后台</text>
				</view>
				<text class="admin-arrow">→</text>
			</view>
		</view>

		<!-- 退出登录按钮 -->
		<view class="logout-section">
			<button class="logout-btn" @tap="loginout">退出登录</button>
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
	role: '',
	phone: ''
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
				username: response.data.username || '茶饮用户',
				avatar: response.data.avatar || 'https://img-hepingan.oss-cn-hangzhou.aliyuncs.com/page/a.jpg',
				role: response.data.role || '',
				phone: response.data.phone || '138****8888'
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

// 用户统计数据
const userStats = ref({
	orderCount: 12,
	couponCount: 5,
	points: 1280
})

// 顶部操作栏方法
const goToSettings = () => {
	uni.showToast({
		title: '跳转到设置页面',
		icon: 'none'
	})
}

const goToHelp = () => {
	uni.showToast({
		title: '跳转到客服页面',
		icon: 'none'
	})
}

const showMore = () => {
	uni.showToast({
		title: '显示更多选项',
		icon: 'none'
	})
}

const minimize = () => {
	uni.showToast({
		title: '最小化',
		icon: 'none'
	})
}

const showNotifications = () => {
	uni.showToast({
		title: '显示通知',
		icon: 'none'
	})
}

// 用户信息相关
const editUserInfo = () => {
	uni.navigateTo({
		url: '/pages/user/edit'
	})
}

const upgradeMember = () => {
	uni.showToast({
		title: '跳转到会员升级页面',
		icon: 'none'
	})
}

const goToMembership = () => {
	uni.showToast({
		title: '跳转到会员详情页面',
		icon: 'none'
	})
}

// 快速访问功能
const goToOrders = () => {
	uni.showToast({
		title: '跳转到订单页面',
		icon: 'none'
	})
}

const goToReviews = () => {
	uni.showToast({
		title: '跳转到评价页面',
		icon: 'none'
	})
}

const goToCoupons = () => {
	uni.showToast({
		title: '跳转到优惠券页面',
		icon: 'none'
	})
}

const goToActivities = () => {
	uni.showToast({
		title: '跳转到活动页面',
		icon: 'none'
	})
}

// 管理员入口
const goToAdmin = () => {
	uni.showToast({
		title: '跳转到管理后台',
		icon: 'none'
	})
}

// 退出登录
function loginout(){
	uni.showModal({
		title: '确认退出',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				uni.removeStorageSync("sa-token")
				uni.showToast({
					title: '退出登录'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/login/login",
					});
				}, 1500);
			}
		}
	})
}

// 页面加载时获取用户信息
onMounted(() => {
	getUserInfo()
})
</script>

<style>
.user-container {
	background-color: #F3F8EA;
	min-height: 100vh;
	padding: 0;
}

/* 顶部操作栏 */
.top-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #F3F8EA;
}

.top-left, .top-right {
	display: flex;
	align-items: center;
}

.top-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 10rpx;
}

.top-icon .icon {
	font-size: 32rpx;
	color: #666;
}

/* 用户信息区域 */
.user-profile {
	background-color: #fff;
	padding: 40rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.user-avatar-section {
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 30rpx;
}

.user-info {
	display: flex;
	flex-direction: column;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.upgrade-btn {
	background-color: #45a048;
	color: #fff;
	padding: 15rpx 20rpx;
	border-radius: 5rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 270rpx;
}

.upgrade-text {
	font-size: 25rpx;
	font-weight: bold;
}

.upgrade-arrow {
	font-size: 23srpx;
}

.edit-btn {
	width: 60rpx;
	height: 60rpx;
	background-color: #F5F5F5;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.edit-icon {
	width: 32rpx;
	height: 32rpx;
}

/* 会员状态卡片 */
.membership-card {
	background-color: #fff;
	margin: 0 0 20rpx 0;
	padding: 30rpx;
	display: flex;
	align-items: center;
}

.membership-icon {
	width: 60rpx;
	height: 60rpx;
	background-color: #E8F5E8;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.v-icon {
	font-size: 32rpx;
	font-weight: bold;
	color: #4CAF50;
}

.membership-info {
	flex: 1;
}

.membership-text {
	font-size: 28rpx;
	color: #666;
}

.membership-arrow {
	font-size: 28rpx;
	color: #999;
}

/* 快速访问功能 */
.quick-access {
	background-color: #fff;
	padding: 40rpx 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-around;
}

.quick-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.quick-icon {
	width: 55rpx;
	height: 55rpx;
	margin-bottom: 15rpx;
}

.quick-text {
	font-size: 25rpx;
	color: #666;
}

/* 管理员入口 */
.admin-section {
	margin: 20rpx 0;
}

.admin-card {
	background-color: #fff;
	margin: 0 30rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	border-radius: 12rpx;
	border: 2rpx solid #FFD700;
}

.admin-icon {
	width: 60rpx;
	height: 60rpx;
	background-color: #FFF8DC;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.admin-text {
	font-size: 32rpx;
}

.admin-info {
	flex: 1;
}

.admin-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.admin-desc {
	font-size: 24rpx;
	color: #666;
}

.admin-arrow {
	font-size: 28rpx;
	color: #999;
}


/* 退出登录按钮 */
.logout-section {
	padding: 40rpx 30rpx;
}

.logout-btn {
	width: 100%;
	height: 90rpx;
	background-color: #fff;
	color: #FF4757;
	font-size: 32rpx;
	border: 1rpx solid #E5E5E5;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.logout-btn:active {
	background-color: #F5F5F5;
}
</style>
