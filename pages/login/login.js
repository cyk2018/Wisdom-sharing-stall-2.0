const db = wx.cloud.database()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: ["/images/timg.jfif"]
  },

  getOpenid: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: function (res) {
        var openid = res.result.openId
        that.setData({
          openid: openid
        })
        wx.setStorageSync('openid', openid)
        //本地缓存当前用户的openid 
      },
      fail: function (res) {
        console.log("无法获得用户openid")
      }
    })
  },


  loading: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })

  },

  userLogin: function () {
    //普通用户登录
    this.loading()
    //查询数据库中是否有此用户
    db.collection('user').where({
      _openid: this.data.openid
    }).get({
      success: function (res) {
        //没找到对应用户
        if (res.data.length == 0) {
          db.collection('user').add({
            data: {
              admin: "0"
            }
          })
        }
        wx.switchTab({
          url: '/pages/apply/apply',
          success: function () {
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
    })
  },

  adminLogin: function () {
    this.loading()
    db.collection('user').where({
      _openid: this.data.openid
    }).get({
      success: function (res) {
        if (res.data[0].admin == "1") {
          wx.navigateTo({
            url: '/pages/adminApply/adminApply',
            success: function () {
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
        } else {
          //没有申请成为管理
          wx.hideLoading({
            success: (res) => {
              Toast.fail('请先申请成为管理');
            },
          })
        }
      }
    })
  },

  adminApply: function () {
    var that = this
    that.loading()
    db.collection('user').where({
      _openid: that.data.openid
    }).get({
      success: function (res) {
        //用户存在且不是管理员
        if (res.data.length > 0 && res.data[0].admin == "0") {
          db.collection('user').where({
              _openid: that.data.openid
            })
            .update({
              data: {
                admin: "1"
              },
              success: function () {
                wx.hideLoading({
                  success: (res) => {
                    Toast.success('申请成功')
                  },
                })
              }
            })
        }
        //用户是管理员
        if (res.data[0].admin == "1") {
          wx.hideLoading({
            success: (res) => {
              Toast.success('已申请')
            },
          })
        }
        //用户不存在
        if (res.data.length == 0) {
          db.collection('user').add({
            admin: "1",
            success: function () {
              wx.hideLoading({
                success: (res) => {
                  Toast.success('申请成功')
                },
              })
            }
          })
        }
      },
      complete: function () {
        that.setData({
          adminTextColor: "#DC143C"
        })
      }
    })
  },

  getSystemInfo: function () {
    wx.getSystemInfo({
      success: (result) => {
        console.log("这么小声还想打印屏幕大小？")
        this.setData({
          windowHeight: result.windowHeight + "px",
          windowWidth: result.windowWidth + "px"
        })
        // console.log(result.screenWidth)
        // console.log(result.screenHeight)
        // console.log(result.windowWidth)
        // console.log(result.windowHeight)
      },
      fail: function () {
        console.log("听不见，重来")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid()
    this.getSystemInfo()
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