import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database()
// pages/myViolation/myViolation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    Violated: false

  },

  showViolation: function (res) {
    //console.log(res.detail.length)
    if (res.detail.length == 2) {
      //console.log("展开面板")
      this.search()
      setTimeout(() => {
        wx.hideLoading();
        if (this.data.Violated) {
          //console.log("拿到数据了呀")
          this.setData({
            activeNames: res.detail,
          });
        } else {
          Notify({
            type: 'warning',
            message: '当前无违规记录'
          })
        }
      }, 1000)
    } else {
      //此处主要是如果搜到数据而且展开面板之后可以调用这里折叠面板
      this.setData({
        activeNames: res.detail,
      });
    }
  },

  search() {
    var that = this
    wx.showLoading({ //弹出框显示内容，当出现hideloading时消失
      title: '加载中',
    })
    db.collection('violation')
      .where({
        _openid: wx.getStorageSync('openid')
      })
      .get({
        success(res) {
          //console.log(res.data.length)
          if (res.data.length == 0) {
            //console.log("执行了")
            that.setData({
              Violated: false
            })
          } else {
            that.setData({
              Violated: true,
              brand: res.data[0].brand,
              Item: res.data[0].Item,
              id: res.data[0]._id,
              recordTime: res.data[0].recordTime.toLocaleString()
            })
          }

        },
        fail() {
          console.log("当前无违规记录")
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})