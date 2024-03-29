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
    type:0,
    message: "开始/结束摆摊"
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
    wx.setStorage({
      data: that.data.day,
      key: 'day',
    })
    wx.setStorage({
      data: that.data.h,
      key: 'h',
    })
    wx.setStorage({
      data: that.data.m,
      key: 'm',
    })
    wx.setStorage({
      data: that.data.s,
      key: 's',
    })
    console.log(that.data.day+':'+that.data.h+':'+that.data.m+':'+that.data.s)
    wx.getStorage({
      key: 'Con',
      success:function(res){
       if(res.data==0)
       {
         wx.setStorage({
           data: 1,
           key: 'Con',
         })
         console.log("开始摆摊")
       }
       else{
         wx.setStorage({
           data: 0,
           key: 'Con',
         })
         console.log("结束摆摊")
       }
       wx.getStorage({
         key: 'Con',
         success(res){
           console.log("在stall中获取Con"+res.data)
           wx.switchTab({
             url: '/pages/mine/mine',
           })
         }
       })

      }
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
    var that=this
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
    console.log("Type:"+that.data.type)

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