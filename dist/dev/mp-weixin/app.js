"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/login/register.js";
  "./pages/user/user.js";
  "./pages/user/edit.js";
}
const _sfc_main = {
  onShow() {
    const token = common_vendor.index.getStorageSync("sa-token");
    if (!token) {
      common_vendor.index.showToast({
        title: "未登录"
      });
      setTimeout(common_vendor.index.navigateTo({
        url: "/pages/login/login"
      }), 1500);
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
