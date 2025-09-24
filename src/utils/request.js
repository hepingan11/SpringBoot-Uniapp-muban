const BASE_URL = 'http://127.0.0.1:9090';

// 封装请求方法
const request = (url, options = {}) => {
	return new Promise((resolve, reject) => {
		// 调用 uni.request 发起请求
		// 获取本地存储的 token
		const token = uni.getStorageSync('sa-token');

		uni.request({
			// 拼接基础 URL 和请求的路径
			url: `${BASE_URL}${url}`, // BASE_URL 为基础 URL，url 为相对路径
			...options, // 展开传入的其他配置，如请求头、请求方法等
			header: {
				...options.header,
				'sa-token': `${token}` // 在请求头中加入 token
			},
			success: (res) => {
				// 请求成功的回调
				if (res.statusCode === 200) {
					// 如果状态码是 200，表示请求成功，返回数据
					resolve(res.data);
				} else if (res.data.code === 401) {
					uni.showToast({
						title: '登录过期',
						icon: 'none',
						duration: 2000
					});
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login' // 这里需要根据你的登录页面路径进行修改
						});
					}, 1500);
				} else {
					// 如果状态码不是 200，则视为失败，拒绝 Promise
					uni.showToast({
						title: '未知错误',
						icon: 'none',
						duration: 2000
					});
					reject(res);
				}
			},
			fail: (error) => {
				// 请求失败的回调
				reject(error); // 拒绝 Promise，并返回失败的错误信息
			}
		});
	});
};


// 请求拦截器
const httpInterceptor = {
	invoke(options) {
		// 1. 非 http 开头需拼接地址
		if (!options.url.startsWith('http')) {
			options.url = BASE_URL + options.url;
		}
		// 2. 请求超时
		options.timeout = 10000;
		// 3. 添加小程序端请求头标识
		options.header = {
			...options.header,
			'source-client': 'miniapp'
		};
		// 4. 添加 token
		const token = uni.getStorageSync('sa-token');
		if (token) {
			options.header.satoken = `${token}`;
		}
	}
};

// 注册拦截器
uni.addInterceptor('request', httpInterceptor);
uni.addInterceptor('uploadFile', httpInterceptor);

export default request;