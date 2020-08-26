// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function (event) {
      // event.detail是vant-app的tabbar组件选择的序号
      // 相当于获取点击van-tabbar-item的序号      
      if (event.detail == 0) {
        this.switchTab("/pages/apply/apply");
        // 设置选中
        this.setData({
          active: event.detail
        });
      }
      if (event.detail == 1) {
        this.switchTab("/pages/reserveFirst/reserveFirst");
        // 设置选中
        this.setData({
          active: event.detail
        });
      }
      if (event.detail == 2) {
        this.switchTab("/pages/recommend/recommend");
        // 设置选中
        this.setData({
          active: event.detail
        });
      }
      if (event.detail == 3) {
        this.switchTab("/pages/mine/mine");
        // 设置选中
        this.setData({
          active: event.detail
        });
      }
    },
    // 自定义tab切换方法增加回调
    switchTab: function (url, callback) {
      if (callback) {
        callback();
      }
      // 调用微信的switchTab切换tabbar
      wx.switchTab({
        url
      });
    }
  }
})