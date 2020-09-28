const seat = require('../../utils/seatJS')
const db = wx.cloud.database()
Page({

  data: {
    name: "",
    selectedSeat: [],
    scaleValue: 3,
    hidden: "hidden",
    maxSelect: 1,
    timer: null,
    show: false,
    hidden: "",
    //有关滑块
    leftTime: "00:00", //滑块左边的时间
    rightTime: "23:59", //滑块右边的时间
    // leftTime 和 rightTime可以控制限定当前区域的开放时间范围
    // 如果遇到跨日期的情况在后面的时间加上 “次日” 二字

    // 控制可移动区域的面积
    AreaSeatHeight: 380,
    AreaSeatWidth: 300,
  },
  //有关滑块的函数
  lowValueChangeAction: function (e) { //改变左滑块
    var leftHour = Math.floor(e.detail.lowValue / 60); //滑块左边的小时
    var leftMinute = e.detail.lowValue % 60; //滑块左边的分钟
    console.log(leftHour);
    this.setData({
      leftTime: leftHour.toString() + ":" + leftMinute.toString(),
    })
    this.search()
  },
  heighValueChangeAction: function (e) { //改变右滑块
    // console.log(e.detail.)
    var rightHour = Math.floor(e.detail.heighValue / 60); //滑块右边的时间
    var rightMinute = e.detail.heighValue % 60; //滑块右边的时间
    this.setData({
      rightTime: rightHour.toString() + ":" + rightMinute.toString()
    })
    this.search()
  },
  hideSlider: function (e) { //隐藏滑块
    this.selectComponent("#zy-slider").hide()
    this.selectComponent("#zy-slider1").hide()
  },

  showSlider: function (e) { //显示滑块
    this.selectComponent("#zy-slider").show()
    this.selectComponent("#zy-slider1").show()
  },

  resetSlider: function (e) { //重置滑块
    this.selectComponent("#zy-slider").reset()
    this.selectComponent("#zy-slider1").reset()
  },
  //以上为有关滑块的函数


  confimReserve: function () {
    //确认预约，在数据库中更新对应的信息，需要预约时间和位置信息
  },

  // 点击每个座位触发的函数
  clickSeat: function (res) {

    let index = res.currentTarget.dataset.index;
    //获得当前点击座位的索引
    console.log(index)
    if (this.data.seatList[index].canClick) {
      //判断当前座位是否被选中，如果选中的话就取消选择，否则的话选择这个，取消对应的
      if (this.data.seatList[index].nowIcon === this.data.seatList[index].selectedIcon) {
        this.processSelected(index)
      } else {
        //清空数组
        this.processUnSelected(index)
      }
    }
    if (this.data.selectedSeat.length == 0) {
      this.setData({
        hidden: "hidden"
      });
    }
  },


  getHourAndMinute: function (res) {
    var n = res.indexOf(":")
    console.log(n)
    var time = new Date()
    time.setHours(res.slice(0, n))
    time.setMinutes(res.slice(n + 1, ))
    return time
  },

  getStallList: function () {
    db.collection('StallArea').where({
      _id: this.data.id
    }).get({
      success: (res) => {
        let stallList = JSON.parse(JSON.stringify(res.data[0].stallList))

        // var stallList = []
        // var stallRow = []
        // var list = res.data[0].stallList
        // list.forEach(function (item) {
        //   item.forEach(function(iitem){
        //     stallRow.push(iitem)
        //   })
        //   stallList.push(item)
        //   stallRow = []
        // })
        // console.log(res.data[0].stallList)
        this.setData({
          seatList: res.data[0].stallList,
          row: res.data[0].rowNum,
          col: res.data[0].columnNum,
          stallList
        })
        this.getSeatArea()
      }
    })
  },

  getSeatArea: function () {
    //控制当前座椅的大小,需要实时测算
    // 在获得当前座位时调用
    var row = this.data.AreaSeatHeight / this.data.row
    var col = this.data.AreaSeatWidth / this.data.col
    // 以上两行通过行数和列数判断当前图形的最小值
    // 此处的设计思路是在固定区域内，通过当前行列数判断每个图形（默认为正方形）的边长
    var n = (col < row) ? col : row
    console.log(row)
    console.log(col)
    this.setData({
      seatScaleHeight: n
    })
  },



  search: function () {
    const _ = db.command
    var startTime = this.getHourAndMinute(this.data.leftTime)
    var endTime = this.getHourAndMinute(this.data.rightTime)

    // console.log(startTime)
    // console.log(endTime)
    //seatList 向 stallList 转换

    var that = this
    db.collection('Reservation').where({
      stallID: that.data.id,
      startTime: _.lt(endTime),
      endTime: _.gt(startTime)
    }).get({
      success: function (res) {
        console.log(res)
        //修改 stallList 对应位置的信息
        var stallList = that.data.stallList
        for (var i = 0; i < res.data.length; i++) {
          var col = res.data[i].col
          var row = res.data[i].row
          stallList[row][col].type = 3
        }

        that.setData({
          stallList
        })
        

      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var res = seat.getMoveableArea(140)
    var areaHeight = res[0]
    var areaWidth = res[1]

    this.setData({
      id: options.id,
      name: options.name,
      areaHeight,
      areaWidth
      // startTime: options.startTime,
      // closeTime: options.closeTime,
    })

    this.getStallList()
    this.search()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  onShow: function () {},

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