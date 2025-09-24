<template>
	<view class="index-container">
		<!-- 头部搜索栏 -->
		<view class="header">
			<view class="search-bar">
				<image src="/static/icon/search.png" class="search-icon"></image>
				<input type="text" placeholder="搜索茶饮、店铺..." class="search-input" />
			</view>
			<view class="header-actions">
				<view class="notification-btn" @tap="showNotifications">
					<text class="notification-icon">🔔</text>
					<view class="notification-badge" v-if="hasNotification">3</view>
				</view>
				<view class="avatar" @tap="goToProfile">
					<image src="../../static/user.png" class="avatar-img"></image>
				</view>
			</view>
		</view>

		<!-- 吐槽功能模块 -->
		<view class="complaint-section">
			<view class="section-header">
				<text class="section-title">茶饮吐槽</text>
				<text class="more-btn" @tap="goToComplaintList">更多 ></text>
			</view>
			<view class="feedback-buttons">
				<button class="complaint-btn" @tap="quickComplaint">
					<text class="complaint-icon">😤</text>
					<text class="complaint-text">我要吐槽</text>
				</button>
				<button class="praise-btn" @tap="quickPraise">
					<text class="praise-icon">😊</text>
					<text class="praise-text">我要好评</text>
				</button>
			</view>
			<view class="hot-complaints">
				<view class="complaint-item" v-for="(item, index) in hotComplaints" :key="index" @tap="viewComplaint(item)">
					<view class="complaint-content">
						<text class="complaint-text-content">{{ item.content }}</text>
						<view class="complaint-meta">
							<text class="complaint-author">{{ item.author }}</text>
							<text class="complaint-time">{{ item.time }}</text>
						</view>
					</view>
					<view class="complaint-stats">
						<image src="/static/icon/Like.png" class="like-icon"></image>
						<text class="like-count">{{ item.likes }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 优惠活动模块 -->
		<view class="promotion-section">
			<view class="section-header">
				<text class="section-title">优惠活动</text>
				<text class="more-btn" @tap="goToPromotions">更多 ></text>
			</view>
			<view class="promotion-item" @tap="viewPromotion(currentPromotion)">
				<image :src="currentPromotion.image" class="promotion-image" mode="cover"></image>
				<view class="promotion-content">
					<text class="promotion-title">{{ currentPromotion.title }}</text>
					<text class="promotion-desc">{{ currentPromotion.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 推荐茶饮商品 -->
		<view class="products-section">
			<view class="section-header">
				<text class="section-title">推荐茶饮</text>
			</view>
			<view class="products-grid" v-if="!loading">
				<view class="product-item" v-for="(product, index) in filteredProducts" :key="index" @tap="viewProduct(product)">
					<image :src="product.image" class="product-image"></image>
					<view class="product-info">
						<text class="product-name">{{ product.name }}</text>
						<text class="product-desc">{{ product.desc }}</text>
						<view class="product-price">
							<text class="current-price">¥{{ product.price }}</text>
							<text class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</text>
						</view>
						<view class="product-tags">
							<text class="tag" v-for="tag in product.tags" :key="tag">{{ tag }}</text>
						</view>
					</view>
					<button class="add-cart-btn" @tap.stop="addToCart(product)">
						<text class="add-icon">+</text>
					</button>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-container" v-if="loading">
				<view class="loading-spinner"></view>
				<text class="loading-text">正在加载商品...</text>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-container" v-if="!loading && filteredProducts.length === 0">
				<text class="empty-icon">🍵</text>
				<text class="empty-text">暂无推荐商品</text>
			</view>
		</view>

	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '@/utils/request.js'

// 响应式数据
const hasNotification = ref(true)
const cartCount = ref(3)
const loading = ref(false)
const products = ref([])

// 热门吐槽数据
const hotComplaints = ref([
	{
		id: 1,
		content: '今天点的绿茶太甜了，糖分超标！',
		author: '茶饮达人',
		time: '2小时前',
		likes: 128
	},
	{
		id: 2,
		content: '这家店的珍珠煮得不够软糯，口感一般',
		author: '珍珠控',
		time: '4小时前',
		likes: 89
	},
	{
		id: 3,
		content: '新品上市，但是等了好久才做好',
		author: '等待者',
		time: '6小时前',
		likes: 67
	}
])

// 当前优惠活动数据
const currentPromotion = ref({
	id: 1,
	title: '新用户专享',
	desc: '首单立减10元',
	image: 'https://img-hepingan.oss-cn-hangzhou.aliyuncs.com/page1/%E7%BB%98%E5%88%B6%E4%B9%8C%E9%BE%99%E8%8C%B6%E5%9B%BE%E7%89%87%20(2).png'
})

// 获取推荐商品数据
const getHotTeaList = async () => {
	try {
		loading.value = true
		const response = await request('/tea/hotList', {
			method: 'GET'
		})
		
		if (response.code === 200) {
			// 处理返回的商品数据，转换为前端需要的格式
			products.value = response.data.map(item => ({
				id: item.teaId,
				name: item.teaName,
				desc: item.introduce,
				price: item.discountPrice || item.price, // 优先显示折扣价
				originalPrice: item.discountPrice ? item.price : null, // 如果有折扣价，原价作为划线价
				image: item.imageList && item.imageList.length > 0 ? item.imageList[0] : 'https://img-hepingan.oss-cn-hangzhou.aliyuncs.com/page/a.jpg',
				category: item.category,
				tags: generateTags(item), // 根据商品信息生成标签
				createdTime: item.createdTime
			}))
		} else {
			uni.showToast({
				title: response.msg || '获取商品失败',
				icon: 'none'
			})
		}
	} catch (error) {
		console.error('获取推荐商品失败:', error)
		uni.showToast({
			title: '网络错误，请重试',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 根据商品信息生成标签
const generateTags = (item) => {
	const tags = []
	
	// 如果有折扣价，添加优惠标签
	if (item.discountPrice && item.discountPrice < item.price) {
		tags.push('优惠')
	}
	
	// 根据创建时间判断是否为新品（假设7天内为新品）
	const now = new Date()
	const createdTime = new Date(item.createdTime)
	const daysDiff = (now - createdTime) / (1000 * 60 * 60 * 24)
	if (daysDiff <= 7) {
		tags.push('新品')
	}
	
	// 如果没有标签，添加默认标签
	if (tags.length === 0) {
		tags.push('推荐')
	}
	
	return tags
}

// 计算属性：直接返回所有商品
const filteredProducts = computed(() => {
	return products.value
})

// 方法
const showNotifications = () => {
	uni.showToast({
		title: '查看通知',
		icon: 'none'
	})
}

const goToProfile = () => {
	uni.navigateTo({
		url: '/pages/user/user'
	})
}

const quickComplaint = () => {
	uni.showToast({
		title: '跳转到吐槽页面',
		icon: 'none'
	})
}

const quickPraise = () => {
	uni.showToast({
		title: '跳转到好评页面',
		icon: 'none'
	})
}

const goToComplaintList = () => {
	uni.showToast({
		title: '查看所有吐槽',
		icon: 'none'
	})
}

const viewComplaint = (complaint) => {
	uni.showToast({
		title: `查看吐槽：${complaint.content}`,
		icon: 'none'
	})
}

const goToPromotions = () => {
	uni.showToast({
		title: '查看所有优惠',
		icon: 'none'
	})
}

const viewPromotion = (promotion) => {
	uni.showToast({
		title: `查看活动：${promotion.title}`,
		icon: 'none'
	})
}

const viewProduct = (product) => {
	uni.showToast({
		title: `查看商品：${product.name}`,
		icon: 'none'
	})
}

const addToCart = (product) => {
	cartCount.value++
	uni.showToast({
		title: `已添加到购物车`,
		icon: 'success'
	})
}

// 页面加载时获取数据
onMounted(() => {
	getHotTeaList()
})

</script>

<style>
.index-container {
	background-color: #F3F8EA;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 头部样式 */
.header {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #fff;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.search-bar {
	flex: 1;
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	border-radius: 50rpx;
	padding: 20rpx 30rpx;
	margin-right: 20rpx;
}

.search-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 15rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.header-actions {
	display: flex;
	align-items: center;
}

.notification-btn {
	position: relative;
	margin-right: 20rpx;
}

.notification-icon {
	font-size: 40rpx;
	color: #666;
}

.notification-badge {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	background-color: #ff4757;
	color: #fff;
	font-size: 20rpx;
	padding: 4rpx 8rpx;
	border-radius: 20rpx;
	min-width: 30rpx;
	text-align: center;
}

.avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	overflow: hidden;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

/* 吐槽功能样式 */
.complaint-section {
	background-color: #fff;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.more-btn {
	font-size: 24rpx;
	color: #999;
}

.feedback-buttons {
	display: flex;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.complaint-btn, .praise-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.complaint-btn {
	background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
	color: #fff;
}

.praise-btn {
	background: linear-gradient(135deg, #4ecdc4, #44a08d);
	color: #fff;
}

.complaint-icon, .praise-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
}

.complaint-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.complaint-item:last-child {
	border-bottom: none;
}

.complaint-content {
	flex: 1;
}

.complaint-text-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
	margin-bottom: 10rpx;
}

.complaint-meta {
	display: flex;
	align-items: center;
}

.complaint-author {
	font-size: 24rpx;
	color: #666;
	margin-right: 20rpx;
}

.complaint-time {
	font-size: 24rpx;
	color: #999;
}

.complaint-stats {
	display: flex;
	align-items: center;
}

.like-icon {
	width: 24rpx;
	height: 24rpx;
	margin-right: 8rpx;
}

.like-count {
	font-size: 24rpx;
	color: #666;
}

/* 优惠活动样式 */
.promotion-section {
	background-color: #fff;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.promotion-item {
	position: relative;
	height: 300rpx;
	border-radius: 15rpx;
	overflow: hidden;
}

.promotion-image {
	width: 100%;
	height: 100%;
}

.promotion-content {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	padding: 40rpx 30rpx 30rpx;
	color: #fff;
}

.promotion-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.promotion-desc {
	font-size: 24rpx;
	opacity: 0.9;
}

/* 推荐商品样式 */
.products-section {
	background-color: #fff;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}


.products-grid {
	display: flex;
	flex-wrap: wrap;
	margin-top: 30rpx;
	justify-content: space-between;
}

.product-item {
	width: calc(50% - 10rpx);
	margin-bottom: 30rpx;
	background-color: #f8f9fa;
	border-radius: 15rpx;
	overflow: hidden;
	position: relative;
}

.product-image {
	width: 100%;
	height: 200rpx;
}

.product-info {
	padding: 20rpx;
}

.product-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.product-desc {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 15rpx;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
}

.product-price {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.current-price {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff4757;
	margin-right: 15rpx;
}

.original-price {
	font-size: 24rpx;
	color: #999;
	text-decoration: line-through;
}

.product-tags {
	display: flex;
	flex-wrap: wrap;
}

.tag {
	font-size: 20rpx;
	color: #759f1a;
	background-color: #edfec3;
	padding: 4rpx 12rpx;
	border-radius: 10rpx;
	margin-right: 10rpx;
	margin-bottom: 8rpx;
}

.add-cart-btn {
	position: absolute;
	bottom: 20rpx;
	right: 20rpx;
	width: 60rpx;
	height: 60rpx;
	background-color: #95ca22;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
}

/* 加载状态样式 */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid #f3f3f3;
	border-top: 4rpx solid #007AFF;
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
	color: #666;
}

/* 空状态样式 */
.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

</style>
