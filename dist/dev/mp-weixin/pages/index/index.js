"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const hasNotification = common_vendor.ref(true);
    const cartCount = common_vendor.ref(3);
    const loading = common_vendor.ref(false);
    const products = common_vendor.ref([]);
    const hotComplaints = common_vendor.ref([
      {
        id: 1,
        content: "今天点的绿茶太甜了，糖分超标！",
        author: "茶饮达人",
        time: "2小时前",
        likes: 128
      },
      {
        id: 2,
        content: "这家店的珍珠煮得不够软糯，口感一般",
        author: "珍珠控",
        time: "4小时前",
        likes: 89
      },
      {
        id: 3,
        content: "新品上市，但是等了好久才做好",
        author: "等待者",
        time: "6小时前",
        likes: 67
      }
    ]);
    const currentPromotion = common_vendor.ref({
      id: 1,
      title: "新用户专享",
      desc: "首单立减10元",
      image: "https://img-hepingan.oss-cn-hangzhou.aliyuncs.com/page1/%E7%BB%98%E5%88%B6%E4%B9%8C%E9%BE%99%E8%8C%B6%E5%9B%BE%E7%89%87%20(2).png"
    });
    const getHotTeaList = async () => {
      try {
        loading.value = true;
        const response = await utils_request.request("/tea/hotList", {
          method: "GET"
        });
        if (response.code === 200) {
          products.value = response.data.map((item) => ({
            id: item.teaId,
            name: item.teaName,
            desc: item.introduce,
            price: item.discountPrice || item.price,
            // 优先显示折扣价
            originalPrice: item.discountPrice ? item.price : null,
            // 如果有折扣价，原价作为划线价
            image: item.imageList && item.imageList.length > 0 ? item.imageList[0] : "https://img-hepingan.oss-cn-hangzhou.aliyuncs.com/page/a.jpg",
            category: item.category,
            tags: generateTags(item),
            // 根据商品信息生成标签
            createdTime: item.createdTime
          }));
        } else {
          common_vendor.index.showToast({
            title: response.msg || "获取商品失败",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("获取推荐商品失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const generateTags = (item) => {
      const tags = [];
      if (item.discountPrice && item.discountPrice < item.price) {
        tags.push("优惠");
      }
      const now = /* @__PURE__ */ new Date();
      const createdTime = new Date(item.createdTime);
      const daysDiff = (now - createdTime) / (1e3 * 60 * 60 * 24);
      if (daysDiff <= 7) {
        tags.push("新品");
      }
      if (tags.length === 0) {
        tags.push("推荐");
      }
      return tags;
    };
    const filteredProducts = common_vendor.computed(() => {
      return products.value;
    });
    const showNotifications = () => {
      common_vendor.index.showToast({
        title: "查看通知",
        icon: "none"
      });
    };
    const goToProfile = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/user"
      });
    };
    const quickComplaint = () => {
      common_vendor.index.showToast({
        title: "跳转到吐槽页面",
        icon: "none"
      });
    };
    const quickPraise = () => {
      common_vendor.index.showToast({
        title: "跳转到好评页面",
        icon: "none"
      });
    };
    const goToComplaintList = () => {
      common_vendor.index.showToast({
        title: "查看所有吐槽",
        icon: "none"
      });
    };
    const viewComplaint = (complaint) => {
      common_vendor.index.showToast({
        title: `查看吐槽：${complaint.content}`,
        icon: "none"
      });
    };
    const goToPromotions = () => {
      common_vendor.index.showToast({
        title: "查看所有优惠",
        icon: "none"
      });
    };
    const viewPromotion = (promotion) => {
      common_vendor.index.showToast({
        title: `查看活动：${promotion.title}`,
        icon: "none"
      });
    };
    const viewProduct = (product) => {
      common_vendor.index.showToast({
        title: `查看商品：${product.name}`,
        icon: "none"
      });
    };
    const addToCart = (product) => {
      cartCount.value++;
      common_vendor.index.showToast({
        title: `已添加到购物车`,
        icon: "success"
      });
    };
    common_vendor.onMounted(() => {
      getHotTeaList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: hasNotification.value
      }, hasNotification.value ? {} : {}, {
        c: common_vendor.o(showNotifications),
        d: common_assets._imports_1,
        e: common_vendor.o(goToProfile),
        f: common_vendor.o(goToComplaintList),
        g: common_vendor.o(quickComplaint),
        h: common_vendor.o(quickPraise),
        i: common_vendor.f(hotComplaints.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.content),
            b: common_vendor.t(item.author),
            c: common_vendor.t(item.time),
            d: common_vendor.t(item.likes),
            e: index,
            f: common_vendor.o(($event) => viewComplaint(item), index)
          };
        }),
        j: common_assets._imports_2,
        k: common_vendor.o(goToPromotions),
        l: currentPromotion.value.image,
        m: common_vendor.t(currentPromotion.value.title),
        n: common_vendor.t(currentPromotion.value.desc),
        o: common_vendor.o(($event) => viewPromotion(currentPromotion.value)),
        p: !loading.value
      }, !loading.value ? {
        q: common_vendor.f(filteredProducts.value, (product, index, i0) => {
          return common_vendor.e({
            a: product.image,
            b: common_vendor.t(product.name),
            c: common_vendor.t(product.desc),
            d: common_vendor.t(product.price),
            e: product.originalPrice
          }, product.originalPrice ? {
            f: common_vendor.t(product.originalPrice)
          } : {}, {
            g: common_vendor.f(product.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            }),
            h: common_vendor.o(($event) => addToCart(), index),
            i: index,
            j: common_vendor.o(($event) => viewProduct(product), index)
          });
        })
      } : {}, {
        r: loading.value
      }, loading.value ? {} : {}, {
        s: !loading.value && filteredProducts.value.length === 0
      }, !loading.value && filteredProducts.value.length === 0 ? {} : {});
    };
  }
};
wx.createPage(_sfc_main);
