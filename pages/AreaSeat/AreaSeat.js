var App = getApp()
var jsonData = require('../../data/json')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    row: 0,
    column: 0,
    seatList: [],
    seatScaleHeight: 50,
    AreaSeatHeight: 320,
    AreaSeatWidth: 300,
  },

  // 这个函数控制着当前座位列表
  showArea: function (res) {
    // console.log(res)
    // 如果是列数发生了变化，因为数组是按行存储的，所以需要重新生成数组
    if (res.beforeRow == res.nowRow) {
      var seatList = []
      var beforeRow = 0
      var beforeColumn = 0
    } else {
      // 如果列数没有发生变化，而行数发生了变化，只需要对数组最后几个元素进行删除
      var seatList = this.data.seatList
      var beforeRow = res.beforeRow
      var beforeColumn = 0
    }
    var row = res.nowRow
    var column = res.nowColumn
    if (beforeRow > row) {
      for (var i = 0; i < column; i++) {
        seatList.pop()
      }
    } else {
      for (var i = beforeRow; i < row; i++) {
        var seatRowList = []
        for (var j = beforeColumn; j < column; j++) {
          var seat = {
            // row: i + 1,
            // col: j + 1,
            grow: i + 1,
            gcol: j + 1,
            icon: "../../images/image_can_select_click.png",
            // canClick: true
          }
          seatRowList.push(seat)
        }
        // console.log(seatRowList)
        var seatList = seatList.concat(seatRowList)

        // console.log(seatList)
      }
    }

    this.setData({
      seatList: seatList
    })

    this.getSeatArea()
  },

  getMoveableArea: function () {
    //可移动区域的宽度
    // todo
    // 这里的宽度:屏幕宽度; 这里的高度:屏幕高度 - 状态栏高度;
    var windowWidth = App.globalData.screenWidth
    var windowHeight = App.globalData.screenHeight
    // console.log(areaWidth)
    // console.log(areaHeight)
    var areaHeight = windowHeight - 44 - 50 - 50 - 50

    // 这里的函数一定要随项目进度更改，目前这样设置是为了减去上面三个单元格的高度
    var areaWidth = windowWidth
    this.setData({
      areaHeight,
      areaWidth
    })
  },

  getSeatArea: function () {
    //控制当前座椅的大小,需要实时测算
    // 在获得当前座位时调用
    var row = this.data.AreaSeatHeight / this.data.row
    var col = this.data.AreaSeatWidth / this.data.column
    // 以上两行通过行数和列数判断当前图形的最小值
    // 此处的设计思路是在固定区域内，通过当前行列数判断每个图形（默认为正方形）的边长
    var n = (col < row) ? col : row
    this.setData({
      seatScaleHeight: n
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getMoveableArea()


    that.getIcon()
    var data = that.returnRowAndCol(1, 1)
    db.collection('StallArea').where({
      _id: options.area_id
    }).get({
      success: function (res) {
        if (res.data.length != 0) {
          console.log(res.data[0].stallList)
          that.setData({
            seatList: res.data[0].stallList,
            row: res.data[0].rowNum,
            column: res.data[0].columnNum
          })

          that.getSeatArea()
        }

      }
    })
    that.setData({
      row: 1,
      column: 1,
      max_number: options.max_number,
      area_id: options.area_id,
    })
    that.showArea(data)
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

  clickSeat: function (res) {
    var that = this
    var id = res.currentTarget.id
    // console.log(id)
    var loc = id.indexOf("-")
    var row = id.slice(0, loc)
    var col = id.slice(loc + 1, id.length)
    // console.log(row)
    // console.log(col)
    var locInArray = (parseInt(row) - 1) * that.data.column + parseInt(col) - 1
    // 这里拿到的数据是字符串类型，所以需要转换为整型
    // console.log(locInArray)
    var seat = 'seatList[' + locInArray + ']'
    var seatIcon = seat + '.icon'
    if (that.data.seatList[locInArray].icon == "../../images/image_can_select_click.png") {
      // console.log(that.data.seatList[locInArray])
      that.setData({
        [seatIcon]: "../../images/close.png"
      })
    } else {
      // console.log(that.data.seatList[locInArray])
      that.setData({
        [seatIcon]: "../../images/image_can_select_click.png"
      })
    }

  },

  // 此函数是返回一个变化前后行列值构成的对象
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 在这里调用云数据库存储相应的数据
    console.log("不要催了正在做了")
    db.collection('StallArea').where({
      _id: this.data.area_id
    }).update({
      data: {
        stallList: this.data.seatList,
        rowNum: this.data.row,
        columnNum: this.data.column
      },
      success: function (res) {
        console.log("好，很有精神")
      },
      fail: function (res) {
        console.log(res)
      }
    })
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