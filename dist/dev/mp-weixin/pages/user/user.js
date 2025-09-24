"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userInfo = common_vendor.ref({
      username: "",
      avatar: "",
      role: "",
      phone: ""
    });
    const loading = common_vendor.ref(false);
    const getUserInfo = async () => {
      try {
        loading.value = true;
        const response = await utils_request.request("/user/info", {
          method: "GET"
        });
        if (response.code === 200) {
          userInfo.value = {
            username: response.data.username || "茶饮用户",
            avatar: response.data.avatar || "https://img-hepingan.oss-cn-hangzhou.aliyuncs.com/page/a.jpg",
            role: response.data.role || "",
            phone: response.data.phone || "138****8888"
          };
        } else {
          common_vendor.index.showToast({
            title: response.msg || "获取用户信息失败",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const userStats = common_vendor.ref({
      orderCount: 12,
      couponCount: 5,
      points: 1280
    });
    const editUserInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/edit"
      });
    };
    const upgradeMember = () => {
      common_vendor.index.showToast({
        title: "跳转到会员升级页面",
        icon: "none"
      });
    };
    const goToMembership = () => {
      common_vendor.index.showToast({
        title: "跳转到会员详情页面",
        icon: "none"
      });
    };
    const goToOrders = () => {
      common_vendor.index.showToast({
        title: "跳转到订单页面",
        icon: "none"
      });
    };
    const goToReviews = () => {
      common_vendor.index.showToast({
        title: "跳转到评价页面",
        icon: "none"
      });
    };
    const goToCoupons = () => {
      common_vendor.index.showToast({
        title: "跳转到优惠券页面",
        icon: "none"
      });
    };
    const goToActivities = () => {
      common_vendor.index.showToast({
        title: "跳转到活动页面",
        icon: "none"
      });
    };
    const goToAdmin = () => {
      common_vendor.index.showToast({
        title: "跳转到管理后台",
        icon: "none"
      });
    };
    function loginout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("sa-token");
            common_vendor.index.showToast({
              title: "退出登录"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/login/login"
              });
            }, 1500);
          }
        }
      });
    }
    common_vendor.onMounted(() => {
      getUserInfo();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatar,
        b: common_vendor.t(userInfo.value.username || "茶饮用户"),
        c: common_vendor.o(upgradeMember),
        d: common_assets._imports_0$1,
        e: common_vendor.o(editUserInfo),
        f: common_vendor.t(userStats.value.orderCount),
        g: common_vendor.t(userStats.value.points),
        h: common_vendor.o(goToMembership),
        i: common_assets._imports_1$1,
        j: common_vendor.o(goToOrders),
        k: common_assets._imports_2$1,
        l: common_vendor.o(goToReviews),
        m: common_assets._imports_3,
        n: common_vendor.o(goToCoupons),
        o: common_assets._imports_4,
        p: common_vendor.o(goToActivities),
        q: userInfo.value.role === "ADMIN"
      }, userInfo.value.role === "ADMIN" ? {
        r: common_vendor.o(goToAdmin)
      } : {}, {
        s: common_vendor.o(loginout)
      });
    };
  }
};
wx.createPage(_sfc_main);
