const db = wx.cloud.database()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({


  /**
   * 页面的初始数据
   */
  data: {

  },

  loading: function () {
    wx.showLoading({
      title: '加载中',
    })
  },

  userLogin: function () {
    this.loading()
    var openid = wx.getStorage({
      key: 'openid',
    })
    this.setData({
      openid: openid
    })
    db.collection('user').where({
      _openid: this.data.openid
    }).get({
      success: function (res) {
        console.log(res.data.length)
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
          Toast.fail('请先申请成为管理');
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
        //console.log(res)
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
        if (res.data[0].admin == "1") {
          wx.hideLoading({
            success: (res) => {
              Toast.success('已申请')
            },
          })
          
        }
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