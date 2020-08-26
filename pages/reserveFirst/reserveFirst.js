const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    choose: 0,
    startReserveTime: "",
    buttonShow: false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    //minDate: new Date().getTime()
    //minDate: new Date().getTime(),
    //maxDate: new Date(2019, 10, 1).getTime(),
  },

  chooseOnMap: function () {
    //去数据库中查询对应的信息
    // db.collection('markers').where({

    // })
    wx.navigateTo({
      url: '/pages/reserve/reserve',
    })
  },

  cancelTime: function () {
    this.setData({
      show: false
    })
  },

  chooseTime: function (res) {
    var that = this
    var id = res.currentTarget.id
    var title = ""
    var choose = 0
    if (id == "start") {
      title = "请选择开始时间"
      choose = 1
    } else {
      title = "请选择结束时间"
      choose = 2
    }
    if (choose == 2 && that.data.startReserveTime.length == 0) {
      wx.showToast({
        title: '未设置开始时间',
        icon: 'none'
      })
    } else {
      that.setData({
        show: true,
        nowTitle: title,
        choose: choose
      })
    }
  },

  confirmTime: function (res) {
    console.log(res)
    var that = this
    if (that.data.choose == 1) {
      that.setData({
        show: false,
        startReserveTime: res.detail,
        //currentDate: res.detail
      })
    }
    //&& that.data.startReserveTime.length > 0
    if (that.data.choose == 2 ) {
      that.setData({
        show: false,
        endReserveTime: res.detail,
        buttonShow: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '预约选摊',
    })
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1
      });
    }
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