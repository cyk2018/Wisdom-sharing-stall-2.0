const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  insert: function () {
    //禁用按钮
    wx.showLoading({
      title: '数据请求中',
    })
    db.collection('myReserve').add({
      data: {
        start_time: "3:00",
        close_time: "5:00"
      },
      success:function(){
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail:function(){
        console.log("添加数据失败")
      },
      complete:function(){
        //取消禁用
      }
    })
  },

  search: function () {
    var openid
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        openid = res.data
      }
    })
    db.collection('myReserve').where({
      _openid: openid
    }).get({
      success: function (res) {
        console.log(res)
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