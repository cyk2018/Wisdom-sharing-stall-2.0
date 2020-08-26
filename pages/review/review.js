const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: false,
    columns: ['食品类', '服装类', '图书类', '手工艺品类', '农产品类', '娱乐消遣类'],
    showSex: false,
    sexSelect: ["男", "女", ],
    showOpinion: false,
    opinionSelect: ["申请成功", "申请失败", ],
    condition: ""
  },

  showOpinion: function () {
    this.setData({
      showOpinion: true
    })
  },
  closeOpinion: function () {
    this.setData({
      showOpinion: false
    })
  },
  selectOpinion: function (res) {
    console.log(res)
    this.setData({
      opinion: res.detail.value,
      showOpinion: false
    })
    if (res.detail.index == 0) {
      this.setData({
        condition: "1"
      })
    } else {
      this.setData({
        condition: "-1"
      })
    }
  },

  save: function () {
    if (this.data.condition.length != 0) {
      db.collection('apply').where({
        _id: this.data.id
      }).update({
        data: {
          brand: this.data.brand,
          condition: this.data.condition,
          principal: {
            idcard: this.data.idcard,
            name: this.data.name,
            sex: this.data.sex,
            tel: this.data.tel
          },
          type: this.data.type
        },
        success: function (res) {
          wx.navigateBack({
            delta: 0,
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      brand: options.brand,
      type: options.type,
      tel: options.tel,
      name: options.name,
      sex: options.sex,
      idcard: options.idcard
    })
  },
  selectSex: function (res) {
    this.setData({
      sex: res.detail.value,
      showSex: false
    })
  },
  showSex: function () {
    this.setData({
      showSex: true
    })
  },
  closeSex: function () {
    this.setData({
      showSex: false
    })
  },

  selectType: function (res) {
    this.setData({
      type: res.detail.value,
      showType: false
    })
  },
  showType: function () {
    this.setData({
      showType: true
    })
  },
  closeType: function () {
    this.setData({
      showType: false
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