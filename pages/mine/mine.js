import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    name: "123",
    check: false,
    checkloading: false,
    message: "扫码摆摊",
  },

  exit: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  scan: function () {
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        console.log(res)
        var url = "/".concat(res.path)
        if (res.codeVersion == 6 || res.path != "") {
          wx.navigateTo({
            url: url + '?type=' + that.data.type,
            success: function () {
              console.log("跳转成功")
            },
            fail: function () {
              Notify({
                type: 'warning',
                message: '页面跳转失败，请重试'
              });
            }
          })
        }
      }
    })
  },
  bindGetUser() {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                checkloading: true,
                check: true,
                name: res.userInfo.nickName,
                imgUrl: res.userInfo.avatarUrl
              })
              db.collection('user')
                .add({
                  data: {
                    name: that.data.name,
                    imgUrl: that.data.imgUrl,
                    type: 0
                  },
                })
            },
            fail: function () {
              console.log("获取用户信息失败")
            }
          })
        }
      },
      fail: function () {
        console.log("获取用户授权失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '我的信息',
    })

    var checkType
    db.collection('user')
      .where({
        _openid: wx.getStorageSync('openid')
      })
      .get({
        success(res) {
          //获取当前用户的摆摊状态
          //0表示无预约，1表示正在摆摊
          if (res.data[0].type == 1) {
            checkType = "1"
          } else {
            checkType = "0"
          }
          wx.setStorageSync('type', checkType)
        },
        fail() {
          console.log("当前用户没有提交过申请或请求数据失败")
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeCon: function () {
    var that = this
    console.log('refresh')
    wx.getStorage({
      key: 'Con',
      success(res) {
        console.log('在mine中获取Con' + res.data)
        if (res.data == 0) {
          that.setData({
            message: '开始摆摊'
          })
        } else if (res.data == 1) {
          that.setData({
            message: "扫码结束摆摊"
          })
        }
      },
      fail(res) {
        console.log("Con初始化")
        wx.setStorage({
          data: 0,
          key: 'Con',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.changeCon()
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: function (res) {
              //console.log("成功登录") 
            },
            fail: function () {
              console.log("登录失败")
            }
          })
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                check: true,
                name: res.userInfo.nickName,
                imgUrl: res.userInfo.avatarUrl
              })
            },
            fail: function () {
              console.log("获取用户信息失败")
            }
          })
        }
      }
    })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 3
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