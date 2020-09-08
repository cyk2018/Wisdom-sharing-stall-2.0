var jsonData = require('../../data/json')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    row: 0,
    column: 0,
    seatList: []
  },

  showArea: function (res) {
    // console.log(res)
    if (res.beforeRow == res.nowRow) {
      var seatList = []
      var beforeRow = 0
      var beforeColumn = 0
    } else {
      var seatList = this.data.seatList
      var beforeRow = res.beforeRow
      var beforeColumn = 0
    }
    var row = res.nowRow
    var column = res.nowColumn
    for (var i = beforeRow; i < row; i++) {
      var seatRowList = []
      for (var j = beforeColumn; j < column; j++) {
        var seat = {
          row: i,
          col: j,
          grow: i,
          gcol: j
        }
        seatRowList.push(seat)
      }
      // console.log(seatRowList)
      var seatList = seatList.concat(seatRowList)
      console.log(seatList)
    }


    this.setData({
      seatList: seatList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   max_number: options.max_number,
    //   seatArea: getApp().globalData.screenHeight = getApp.globalData.statusBarHeight - (500 * getApp().globalData.screenWidth / 750),
    //   rpxToPx: getApp().globalData.screenWidth / 750
    // })
    this.getIcon()
    var data = this.returnRowAndCol(1, 1)
    this.setData({
      row: 1,
      column: 1
    })
    this.showArea(data)
  },

  getIcon: function () {
    var res = jsonData.dataList
    if (res.errorCode == 0) {
      this.setData({
        seatTypeList: res.seatTypeList
      })
    }
  },

  //通过行列数的改变及时调整当前数组中的数据
  onChangeRow: function (res) {
    var data = this.returnRowAndCol(res.detail, this.data.column)
    this.setData({
      row: res.detail
    })
    this.showArea(data)
  },

  onChangeCol: function (res) {
    var data = this.returnRowAndCol(this.data.row, res.detail)
    this.setData({
      column: res.detail
    })
    this.showArea(data)
  },

  returnRowAndCol: function (row, column) {
    var data = {}
    data.beforeRow = this.data.row
    data.beforeColumn = this.data.column
    data.nowRow = row
    data.nowColumn = column
    return data
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
    // 在这里调用云数据库存储相应的数据
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