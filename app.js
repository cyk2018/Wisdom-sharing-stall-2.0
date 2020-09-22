var QQMapWX = require('./libs/qqmap-wx-jssdk');
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  globalData: {},
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用更高版本的基础库")
    } else {
      wx.cloud.init({
        env: "test-lxqna",
        traceUser: true,
      })
    }

    let that = this
    wx.getSystemInfo({
      success: res => {
        // that.globalData.screenHeight = res.screenHeight;
        that.globalData.screenWidth = res.screenWidth;
        // that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.screenHeight = res.screenHeight - res.statusBarHeight
      }
    })
  },

  qqmapsdk: new QQMapWX({
    key: 'YO6BZ-PIELU-BC4V6-2XZU5-5S4I5-QXB6R'
  }),

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})