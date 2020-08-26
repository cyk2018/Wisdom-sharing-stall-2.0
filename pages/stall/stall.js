const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //nowTime:"",
    day: "01 -01",
    h: "00",
    m: "00",
    s: "00",
    Con: true,
    type: 0,
    message: "开始摆摊"
  },
  //插入1
  setInterval: function () {
    var that = this
    var s = that.data.s
    var m = that.data.m
    var h = that.data.h0
    s++
    setInterval(function () { // 设置定时器
      s++
      if (s >= 60) {
        s = 0 //  大于等于60秒归零
        m++
        if (m >= 60) {
          m = 0 //  大于等于60分归零
          h++
          if (h < 10) {
            // 少于10补零
            that.setData({
              h: '0' + h
            })
          } else {
            that.setData({
              h: h
            })
          }
        }
        if (m < 10) {
          // 少于10补零
          that.setData({
            m: '0' + m
          })
        } else {
          that.setData({
            m: m
          })
        }
      }
      if (s < 10) {
        // 少于10补零
        that.setData({
          s: '0' + s
        })
      } else {
        that.setData({
          s: s
        })
      }
    }, 1000)
  },
  getTime: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'getTime',
      success: function (res) {
        //console.log(res.result)
        //研究一下在本地进行倒计时的效果
        that.setData({
          day: res.result.day,
          h: res.result.h,
          m: res.result.m,
          s: res.result.s
        })
      },
      fail: function () {
        console.log("无法获得用户openid")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this
    if (options.type == 1) {
      that.setData({
        type: 1,
        message: "结束摆摊"
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  //开始摆摊或者摆摊结束时的提示
  ChangeCon: function () {
    var that = this
    if (that.data.type == 0) {
      wx.setStorageSync('type', "1")
    } else {
      wx.setStorageSync('type', "0")
    }
    wx.navigateBack({
      delta: 1,
    })
    if (that.data.type == 0) {
      db.collection('user')
        .where({
          _openid: wx.getStorageSync('openid')
        })
        .update({
          data: {
            type: that.data.type,
            startTime: db.serverDate(),
          }
        })
    } else {
      db.collection('user')
        .where({
          _openid: wx.getStorageSync('openid')
        })
        .update({
          data: {
            type: that.data.type,
            closeTime: db.serverDate(),
          }
        })
    }
  },

  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    //获得当前的服务器时间
    this.getTime()
    //异步操作，1秒之后更新
    setTimeout(() => {
      this.setInterval()
      wx.hideLoading({
        success: (res) => {},
      })
    }, 1000)

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