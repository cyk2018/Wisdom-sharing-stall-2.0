
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check: false
  },

  showDetail: function () {
    wx.navigateTo({
      url: '/pages/myViolation/myViolation' 
    })
  },

  setNavigationBar: function () {
    wx.setNavigationBarTitle({
      title: '我的积分',
    })
  },
  getScore: function () {
    var that = this
    db.collection('apply')
      .where({
        _openid: wx.getStorageSync('openid'),
        newest: 1,
        condition: "1"
      })
      .get({
        success: function (res) {
          // console.log(res.data[0].nowScore)
          var score = res.data[0].score
          if(res.data.length>0){
            that.setData({
              myScore: score,
              check: true
            })
        }
          wx.hideLoading({})
        },
        fail: function (res) {
          console.log("我失败了")
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setNavigationBar()
    this.getScore()
    setTimeout(() => {
      wx.hideLoading();
      if (this.data.check == false) {
        Notify({
          type: 'warning',
          message: '查询品牌积分失败'
        })

      }
    }, 1000)
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