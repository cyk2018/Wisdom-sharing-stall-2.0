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
    leftNum: "", //滑块左边的值
    rightNum: "", //滑块右边的值
    leftTime: "00:00", //滑块左边的时间
    rightTime: "00:00", //滑块右边的时间
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
    if (leftMinute >= 30) {
      leftMinute = "30"
    } else {
      leftMinute = "00"
    }
    //把小时转换为字符串
    if (leftHour < 10) {
      leftHour = "0" + leftHour.toString()
    } else {
      leftHour = leftHour.toString()
    }
    console.log(leftHour);
    this.setData({
      leftTime: leftHour + ":" + leftMinute,
    })
    // this.search()
  },
  heighValueChangeAction: function (e) { //改变右滑块
    // console.log(e.detail.)
    var rightHour = Math.floor(e.detail.heighValue / 60); //滑块右边的时间
    var rightMinute = e.detail.heighValue % 60; //滑块右边的时间
    if (rightMinute >= 30) {
      rightMinute = "30"
    } else {
      rightMinute = "00"
    }
    //把小时转换为字符串
    if (rightHour < 10) {
      rightHour = "0" + rightHour.toString()
    } else {
      rightHour = rightHour.toString()
    }
    this.setData({
      rightTime: rightHour + ":" + rightMinute
    })
    // this.search()
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

  doSearch: function () {
    this.search()
  },
  confirmReserve: function () {
    //确认预约，在数据库中更新对应的信息，需要预约时间和位置信息
    if (this.data.selectedSeat.length == 0) {

    }
    if (this.data.selectedSeat.length == 1) {
      wx.showLoading({
        title: '数据上传中',
      })
      var row = this.data.selectedSeat[0].row
      var col = this.data.selectedSeat[0].col
      var startTime = this.getHourAndMinute(this.data.leftTime)
      var endTime = this.getHourAndMinute(this.data.rightTime)
      db.collection('Reservation').add({
        data: {
          row: row - 1,
          col: col - 1,
          // 这里万万注意要减一，因为数组存放方式和用户看到的不一样，计算机人数数是从零开始的
          startTime: startTime,
          endTime: endTime,
          stallID: this.data.id,
          manageID: this.data.manageIDforUser
        },
        success: function () {
          wx.hideLoading({
            success: (res) => {
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        }

      })
    }

  },

  // 点击每个座位触发的函数
  clickSeat: function (res) {
    // 点击具体的座位进行的操作，将改动保存到列表中
    var that = this
    var id = res.currentTarget.id
    var loc = id.indexOf("-")
    var row = parseInt(id.slice(0, loc))
    var col = parseInt(id.slice(loc + 1, id.length))
    // console.log(row)
    // console.log(col)
    // 这里拿到的数据是字符串类型，所以需要转换为整型
    var seat = 'stallList[' + row + '][' + col + ']'
    var seatType = seat + '.type'
    var seatIcon = seat + '.icon'
    if (that.data.stallList[row][col].type == 1 && that.data.selectedSeat.length < 1) {
      // console.log(that.data.seatList[locInArray])
      that.setData({
        [seatType]: 2,
        [seatIcon]: "../../images/image_is_select.png",
        selectedSeat: [{
          row: row + 1,
          col: col + 1
        }]
      })
    } else if (that.data.stallList[row][col].type == 2) {
      // console.log(that.data.seatList[locInArray])
      that.setData({
        [seatType]: 1,
        [seatIcon]: "../../images/image_can_select_click.png",
        selectedSeat: []
      })
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
        this.setData({
          seatList: res.data[0].stallList,
          row: res.data[0].rowNum,
          col: res.data[0].columnNum,
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
  //获取manageID
  getManageID: function () {
    var that = this
    db.collection('apply')
      .where({
        _openid: wx.getStorageSync('openid'),
        condition: "1"
      })
      .get({
        success: function (res) {
          console.log('res' + res.data[0].manageID);
          that.setData({
            manageIDforUser: res.data[0].manageID
          })
        },
        fail: function (res) {
          console.log("获取经营号失败");
        }
      })
  },


  search: function () {
    const _ = db.command
    var startTime = this.getHourAndMinute(this.data.leftTime)
    var endTime = this.getHourAndMinute(this.data.rightTime)

    var that = this
    db.collection('Reservation').where({
      stallID: that.data.id,
      startTime: _.lt(endTime),
      endTime: _.gt(startTime)
    }).get({
      success: function (res) {
        //重要！ 勿删！进行数组拷贝
        //参考 https://www.cnblogs.com/showjs/p/11358095.html
        let stallList = JSON.parse(JSON.stringify(that.data.seatList))

        for (var i = 0; i < res.data.length; i++) {
          var col = res.data[i].col
          var row = res.data[i].row
          stallList[row][col].type = 3,
            stallList[row][col].icon = "/images/image_has_selected.png"
        }

        that.setData({
          stallList,
          selectedSeat: []
        })


      }
    })
  },

  //  getAreaTime: function(){
  //   var that = this
  //   db.collection('StallArea').where({
  //     _id: that.data.id,
  //   }).get({
  //     success: function (res) {
  //       console.log(parseInt(res.data[0].endTime.split(":")[0]));
  //       that.setData({
  //         leftTime: res.data[0].startTime,
  //         rightTime: res.data[0].endTime,
  //         leftNum: parseInt(res.data[0].startTime.split(":")[0])*60+parseInt(res.data[0].startTime.split(":")[1]),
  //         rightNum: parseInt(res.data[0].endTime.split(":")[0])*60+parseInt(res.data[0].endTime.split(":")[1])
  //       })
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name: options.name,
      areaStartTime: options.startTime,
      areaEndTime: options.closeTime,
      leftNum: parseInt(options.startTime.split(":")[0]) * 60 + parseInt(options.startTime.split(":")[1]),
      rightNum: parseInt(options.closeTime.split(":")[0]) * 60 + parseInt(options.closeTime.split(":")[1])
    })
    console.log(wx.getStorageSync('openid'));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  onShow: function () {
    wx.showLoading({
      title: '数据请求中',
    })
    var res = seat.getMoveableArea(140)
    var areaHeight = res[0]
    var areaWidth = res[1]
    this.setData({
      areaHeight,
      areaWidth
    })
    this.getStallList()
    this.search()
    setTimeout(() => {
      this.getManageID()
    }, 1500)
    wx.hideLoading({
      success: (res) => {},
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