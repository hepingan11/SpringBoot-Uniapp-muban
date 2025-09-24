"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const userInfo = common_vendor.ref({
      username: "",
      avatar: "",
      phone: "",
      email: "",
      bio: "",
      role: ""
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
            username: response.data.username || "",
            avatar: response.data.avatar || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
            bio: response.data.bio || "",
            role: response.data.role || ""
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
    const chooseAvatar = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          uploadAvatar(tempFilePath);
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    const uploadAvatar = async (filePath) => {
      try {
        loading.value = true;
        const uploadResult = await new Promise((resolve, reject) => {
          common_vendor.index.uploadFile({
            url: "http://127.0.0.1:9090/user/updateAvatar",
            filePath,
            name: "file",
            header: {
              "sa-token": common_vendor.index.getStorageSync("sa-token")
            },
            success: (res) => {
              try {
                const data = JSON.parse(res.data);
                resolve(data);
              } catch (e) {
                reject(e);
              }
            },
            fail: reject
          });
        });
        if (uploadResult.code === 200) {
          userInfo.value.avatar = uploadResult.data;
          common_vendor.index.showToast({
            title: "头像上传成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: uploadResult.msg || "头像上传失败",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("头像上传失败:", error);
        common_vendor.index.showToast({
          title: "头像上传失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const saveUserInfo = async () => {
      if (!userInfo.value.username.trim()) {
        common_vendor.index.showToast({
          title: "请输入用户名",
          icon: "none"
        });
        return;
      }
      if (!userInfo.value.phone.trim()) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(userInfo.value.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (userInfo.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.value.email)) {
        common_vendor.index.showToast({
          title: "请输入正确的邮箱格式",
          icon: "none"
        });
        return;
      }
      try {
        loading.value = true;
        const response = await utils_request.request("/user/update", {
          method: "POST",
          data: {
            username: userInfo.value.username,
            phone: userInfo.value.phone,
            email: userInfo.value.email,
            bio: userInfo.value.bio
          }
        });
        if (response.code === 200) {
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: response.msg || "保存失败",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("保存用户信息失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onMounted(() => {
      getUserInfo();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(saveUserInfo),
        c: userInfo.value.avatar
      }, userInfo.value.avatar ? {
        d: userInfo.value.avatar
      } : {}, {
        e: common_vendor.o(chooseAvatar),
        f: userInfo.value.username,
        g: common_vendor.o(($event) => userInfo.value.username = $event.detail.value),
        h: userInfo.value.phone,
        i: common_vendor.o(($event) => userInfo.value.phone = $event.detail.value),
        j: userInfo.value.email,
        k: common_vendor.o(($event) => userInfo.value.email = $event.detail.value),
        l: userInfo.value.bio,
        m: common_vendor.o(($event) => userInfo.value.bio = $event.detail.value),
        n: loading.value
      }, loading.value ? {} : {});
    };
  }
};
wx.createPage(_sfc_main);
