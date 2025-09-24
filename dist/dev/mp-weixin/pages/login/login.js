"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const loginType = common_vendor.ref("wechat");
    const formData = common_vendor.ref({
      username: "",
      password: ""
    });
    const switchLoginType = (type) => {
      loginType.value = type;
    };
    const handleWechatLogin = () => {
      const baseUrl = "http://127.0.0.1:9090";
      common_vendor.index.login({
        provider: "weixin",
        success: (res) => {
          console.log(res.code);
          common_vendor.index.request({
            url: `${baseUrl}/user/wx-login`,
            method: "POST",
            data: res.code,
            success: (res2) => {
              console.log(res2);
              if (res2.data.code === 200) {
                common_vendor.index.setStorageSync("sa-token", res2.data.data.tokenValue);
                common_vendor.index.showToast({
                  title: "登录成功",
                  icon: "success"
                });
                setTimeout(() => {
                  common_vendor.index.switchTab({
                    url: "/pages/index/index"
                  });
                }, 1500);
              } else {
                common_vendor.index.showToast({
                  title: res2.data.msg || "登录失败",
                  icon: "none"
                });
              }
            },
            fail: () => {
              common_vendor.index.showToast({
                title: "网络错误",
                icon: "none"
              });
            }
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "微信登录失败",
            icon: "none"
          });
        }
      });
    };
    const handleLogin = () => {
      if (!formData.value.username || !formData.value.password) {
        common_vendor.index.showToast({
          title: "请输入用户名和密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.request({
        url: "http://127.0.0.1:9090/user/login",
        method: "POST",
        data: formData.value,
        success: (res) => {
          if (res.data.code === 200) {
            console.log(res.data);
            common_vendor.index.setStorageSync("sa-token", res.data.data.tokenValue);
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/index/index"
              });
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "登录失败",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    };
    const handleForgetPassword = () => {
      common_vendor.index.showToast({
        title: "请联系客服重置密码",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loginType.value === "wechat"
      }, loginType.value === "wechat" ? {} : {}, {
        b: loginType.value === "wechat" ? 1 : "",
        c: common_vendor.o(($event) => switchLoginType("wechat")),
        d: loginType.value === "password" ? 1 : "",
        e: common_vendor.o(($event) => switchLoginType("password")),
        f: loginType.value === "wechat"
      }, loginType.value === "wechat" ? {
        g: common_vendor.o(handleWechatLogin)
      } : {}, {
        h: loginType.value === "password"
      }, loginType.value === "password" ? {
        i: formData.value.username,
        j: common_vendor.o(($event) => formData.value.username = $event.detail.value),
        k: formData.value.password,
        l: common_vendor.o(($event) => formData.value.password = $event.detail.value),
        m: common_vendor.o(handleLogin),
        n: common_vendor.o(handleForgetPassword)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
