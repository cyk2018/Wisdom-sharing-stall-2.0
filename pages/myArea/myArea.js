const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAreaNo: false
  },

  
  setMaxNumber: function (res) {
    var id = res.currentTarget.id
    var area = this.data.myAreas[id]
    wx.navigateTo({
      url: '/pages/AreaSeat/AreaSeat?max_number=' + area.stallNum + '&area_id=' + area._id,
    })
  },
  changeInformation: function (res) {
    //console.log(res)
    var id = res.currentTarget.id
    var area = this.data.myAreas[id]
    wx.navigateTo({
      url: '/pages/chooseArea/chooseArea?name=' + area.name + "&address=" + area.address + "&start_time=" + area.startTime + "&close_time=" + area.endTime + "&max_number=" + area.stallNum + "&_id=" + area._id + "&_openid=" + area._openid,
      //这里传递id是为了修改区域信息时快速查询
    })
  },

  gotoPage: function (res) {
    var id = res.currentTarget.id
    var area = this.data.myAreas[id]
    wx.navigateTo({
      url: '/pages/areaDetail/areaDetail?name=' + area.name + "&address=" + area.address + "&start_time=" + area.startTime + "&close_time=" + area.endTime + "&max_number=" + area.stallNum,
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

  getData: function () {
    wx.showLoading({
      title: '数据请求中',
    })
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
      }
    })
    var openid = that.data.openid
    db.collection('StallArea').where({
      _openid: openid
    }).get({
      success: function (res) {
        console.log(res)
        if (res.data.length == 0){
          that.setData({
            myAreas: res.data,
            myAreaNo: true
          })
        }else {
          that.setData({
            myAreas: res.data,
            myAreaNo: false
          })
        }
      }
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
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