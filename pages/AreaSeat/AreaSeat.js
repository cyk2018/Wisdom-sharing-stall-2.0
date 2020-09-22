const db = wx.cloud.database()
const seat = require('../../utils/seatJS');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    row: 0,
    column: 0,
    seatList: [],
    AreaSeatHeight: 320,
    AreaSeatWidth: 300,
  },

  // 这个函数控制着当前座位列表
  showArea: function (res) {
    // console.log(res)
    // res中存储着变化前后的行列值
    // 如果是列数发生了变化，因为数组是按行存储的，所以需要重新生成数组,但是在重新生成数组的过程中又面临着之前存储的记录无法更新的问题
    var seatList = this.data.seatList
    if (res.beforeRow == res.nowRow) {
      // 列数发生了变化
      if (res.beforeColumn > res.nowColumn) {
        // 如果列数减少
        for (var i = 0; i < res.beforeRow; i++) {
          seatList[i].pop()
        }
      }
      for (var i = 0; i < res.beforeRow; i++) {
        var seat = {
          grow: i,
          gcol: res.nowColumn - 1,
          type: 1,
          icon: "../../images/image_can_select_click.png"
        }
        seatList[i].push(seat)
      }
    } else {
      if (res.nowRow > res.beforeRow) {
        // 行数增加
        var seatRowList = []
        for (var i = res.beforeRow; i < res.nowRow; i++) {
          for (var j = 0; j < res.nowColumn; j++) {
            var seat = {
              grow: i,
              gcol: j,
              type: 1,
              icon: "../../images/image_can_select_click.png"
            }
            seatRowList.push(seat)
          }
          seatList.push(seatRowList)
        }
      } else {
        seatList.pop()
      }
    }

    this.setData({
      seatList: seatList
    })

    this.getSeatArea()
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
    var res = seat.getMoveableArea(194)
    var areaHeight = res[0]
    var areaWidth = res[1]
    this.setData({
      areaHeight,
      areaWidth
    })




    var that = this
    db.collection('StallArea').where({
      _id: options.area_id
    }).get({
      success: function (res) {
        console.log(res)
        if (res.data.length != 0) {
          that.setData({
            seatList: res.data[0].stallList,
            row: res.data[0].rowNum,
            column: res.data[0].columnNum
          })
        }
        that.getSeatArea()
      }
    })
    that.setData({
      max_number: options.max_number,
      area_id: options.area_id,
    })
    var data = that.returnRowAndCol(1, 1)
    that.showArea(data)
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
    // 点击具体的座位进行的操作，将改动保存到列表中
    var that = this
    var id = res.currentTarget.id
    // console.log(id)
    var loc = id.indexOf("-")
    var row = parseInt(id.slice(0, loc))
    var col = parseInt(id.slice(loc + 1, id.length))
    // console.log(row)
    // console.log(col)
    // 这里拿到的数据是字符串类型，所以需要转换为整型
    var seat = 'seatList[' + row + '][' + col + ']'
    var seatType = seat + '.type'
    var seatIcon = seat + '.icon'
    if (that.data.seatList[row][col].type == 1) {
      // console.log(that.data.seatList[locInArray])
      that.setData({
        [seatType]: 0,
        [seatIcon]: "../../images/close.png"
      })
    } else {
      // console.log(that.data.seatList[locInArray])
      that.setData({
        [seatType]: 1,
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