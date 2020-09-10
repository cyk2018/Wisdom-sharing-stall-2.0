// pages/myBrand/myBrand.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand: "",
    type: "",
    manageID: "",
    area: "",
    name: "",
    idcard: "",
    tel: "",
    remarks: "",
    check: false
  },
  getBrand: function () {
    var that = this
    // var newest
    // wx.getStorage({
    //   key: 'newest',
    //   success: function (res) {
    //     newest = res.data
    //   }
    // })
    db.collection('apply')
      .where({
        _openid: wx.getStorageSync('openid'),
        newest: 1,
        condition: "1"
      })
      .get({
        success: function (res) {
          // console.log(res.data[0].nowScore)
          console.log(res.data[0]);
          that.setData({
            brand: res.data[0].brand,
            type: res.data[0].type,
            manageID: res.data[0].manageID,
            area: res.data[0].area,
            name: res.data[0].principal.name,
            idcard: res.data[0].principal.idcard,
            tel: res.data[0].principal.tel,
            remarks: res.data[0].remark,
            check: true
          })
          wx.hideLoading({})
        },
        fail: function (res) {
          console.log("我失败了")
        }
      })
  },
  setNavigationBar: function () {
    wx.setNavigationBarTitle({
      title: '我的品牌',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // wx.getStorage({
    //   key: 'openid',
    //   success: function (res) {
    //     that.setData({
    //       openid: res.data
    //     })
    //   }
    // })
    //更新此页面的data数据
    this.setNavigationBar();
    this.getBrand();
    // 无数据，则显示警告
    console.log(that.data.check);
    setTimeout(() => {
      wx.hideLoading();
      if (that.data.check == false) {
        Notify({
          type: 'warning',
          message: '当前无品牌通过资质审核'
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
    wx.showLoading({
      title: '加载中',
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