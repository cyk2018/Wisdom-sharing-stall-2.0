import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database()
// pages/myViolation/myViolation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Violated: false,
    manageIDforUser: "",
    stallID: "",
    item: "",
    recordTime: "",
    remarks: "",
    index: "",
    openid: ""

  },
  setNavigationBar: function () {
    wx.setNavigationBarTitle({
      title: '我的违规',
    })
  },

  getManageID: function(){
    var that = this
    // var openid;
    // wx.getStorage({
    //   key: 'openid',
    //   success: function (res) {
    //     openid = res.data;
    //     console.log(openid);
    //     console.log('get-id');
    //   }
    // })

    db.collection('apply')
      .where({
        _openid: wx.getStorageSync('openid'),
       condition: "1"
      })
      .get({
        success: function(res) {
          console.log('get-manageID');
          console.log('res' + res.data[0].manageID);
          that.setData({
            manageIDforUser: res.data[0].manageID
            // brand: res.data[0].brand,
            // Item: res.data[0].Item,
            // id: res.data[0]._id,
            // recordTime: res.data[0].recordTime.toLocaleString()
          })
    },
        fail: function(res) {
          console.log("当前无有资质品牌信息");
        }
      })

  },
  showViolation: function () {
      var that = this
      console.log(that.data)
      console.log(that.data.manageIDforUser)
      db.collection('Violation')
      .where({
        manageID: that.data.manageIDforUser
      }).get({
        success: function(res) {
          that.setData({
            stallID: res.data[0].stallID,
            item: res.data[0].item,
            recordTime: res.data[0].recordTime.toLocaleString(),
            remarks: res.data[0].remarks,
            Violated: true
          })
        },
        fail: function(res) {
          console.log("查询违规记录失败");
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // wx.getStorage({
    //   key: 'openid',
    //   success: function (res) {
    //     that.setData({
    //       openid: res.data
    //     })
    //   }
    // })
    wx.showLoading({ //弹出框显示内容，当出现hideloading时消失
      title: '加载中',
    })
    console.log('start - setnav');
    that.setNavigationBar();
    console.log('start - get');
    that.getManageID();
    console.log('start - show');
    setTimeout(() => {
      that.showViolation();
      } 
    , 1500)
    setTimeout(() => {
      wx.hideLoading();
      if (that.data.Violated==false) {
        Notify({
          type: 'warning',
          message: '当前无违规信息'
        })

      } 
    }, 3000)
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
    // that.showViolation();
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