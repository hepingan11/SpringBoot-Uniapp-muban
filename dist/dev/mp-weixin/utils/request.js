"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://127.0.0.1:9090";
const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("sa-token");
    common_vendor.index.request({
      // 拼接基础 URL 和请求的路径
      url: `${BASE_URL}${url}`,
      // BASE_URL 为基础 URL，url 为相对路径
      ...options,
      // 展开传入的其他配置，如请求头、请求方法等
      header: {
        ...options.header,
        "sa-token": `${token}`
        // 在请求头中加入 token
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.data.code === 401) {
          common_vendor.index.showToast({
            title: "登录过期",
            icon: "none",
            duration: 2e3
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/login/login"
              // 这里需要根据你的登录页面路径进行修改
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: "未知错误",
            icon: "none",
            duration: 2e3
          });
          reject(res);
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};
const httpInterceptor = {
  invoke(options) {
    if (!options.url.startsWith("http")) {
      options.url = BASE_URL + options.url;
    }
    options.timeout = 1e4;
    options.header = {
      ...options.header,
      "source-client": "miniapp"
    };
    const token = common_vendor.index.getStorageSync("sa-token");
    if (token) {
      options.header.satoken = `${token}`;
    }
  }
};
common_vendor.index.addInterceptor("request", httpInterceptor);
common_vendor.index.addInterceptor("uploadFile", httpInterceptor);
exports.request = request;
