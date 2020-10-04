// pages/stallTest/stallTest.js
const app = getApp()
var qqmapsdk = app.qqmapsdk
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    row: 1,
    col: 1
  },

  database: function (type) {
    var that = this
    // 后续开发要注意一个问题，如果用户开始和结束扫码的摊位不同怎么办
    if (type == 0) {
      db.collection('StallUsageRecord').add({
        data: {
          stallArea: "test",
          row: 0,
          col: 0,
          location: that.data.location,
          startTime: db.serverDate()
        },
        success: function (res) {
          console.log(res)
          that.setData({
            _id: res._id
          })
        }
      })
    } else {
      db.collection('StallUsageRecord')
        .where({
          _id: that.data._id
        }).update({
          data: {
            // stallArea: "test",
            // row: 0,
            // col: 0,
            // location: this.data.location,
            endTime: db.serverDate()
          },
        })
    }


  },

  clickButton: function () {
    wx.showLoading({
      title: '数据上传中'
    })
    this.database(this.data.type)
    if (this.data.type == 0) {
      this.setData({
        type: 1
      })
    } else {
      this.setData({
        type: 0
      })
    }

    var type = this.data.type
    db.collection('user')
      .where({
        _openid: this.data.openid
      })
      .update({
        data: {
          type: type,
        },
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    wx.hideLoading({
      success: (res) => {
        wx.navigateBack({
          delta: 0,
        })
        wx.setStorage({
          data: this.data.type,
          key: 'type',
        })
      },
    })


  },

  getLocation: function () {
    wx.getLocation({
      success: res => {
        console.log(res);
        this.setData({
          // location: res,
        })
        this.getLocal(res.latitude, res.longitude)
        // console.log(app.globalData.location);
      },
    })
  },

  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log("getLocal");
        console.log(res);
        vm.setData({
          location: res.result.address,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function (res) {
        console.log("fail");
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      this.getLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          this.getLocation()
        } else {
          //调用wx.getLocation的API
          this.getLocation()
        }
      }
    })

    var that = this
    wx.getStorage({
      key: 'type',
      success: function (res) {
        if (res.data == 0) {
          that.setData({
            button: "开始摆摊",
            type: res.data
          })
        } else {
          that.setData({
            button: "结束摆摊",
            type: res.data
          })
        }
      }
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
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        this.setData({
          openid: res.data
        })
      }
    })
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