const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noApply: false
  },
  gotoPage: function (res) {
    var index = res.currentTarget.dataset.index;
    var data = this.data.data[index]
    wx.navigateTo({
      url: '/pages/review/review?brand=' + data.brand + "&type=" + data.type + "&tel=" + data.principal.tel + "&idcard=" + data.principal.idcard + "&sex=" + data.principal.sex + "&name=" + data.principal.name + "&id=" + data._id,
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

  refresh: function () {
    var that = this
    db.collection('apply').where({
      newest: 1,
      condition: "0"
    }).get({
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            noApply: true
          })
        } else {
          that.setData({
            data: res.data,
            noApply: false
          })
        }
      },
      fail: function () {
        console.log("获取数据失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refresh()
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