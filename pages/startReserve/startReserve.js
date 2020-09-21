var App = getApp()
var jsonData = require('../../data/json.js');
const db = wx.cloud.database()
Page({

  data: {
    name: "",
    seatTypeList: "",
    seatList: [],
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
    AreaSeatHeight: 320,
    AreaSeatWidth: 470,
  },
  //有关滑块的函数
  lowValueChangeAction: function (e) { //改变左滑块
    var leftHour = Math.floor(e.detail.lowValue / 60); //滑块左边的小时
    var leftMinute = e.detail.lowValue % 60; //滑块左边的分钟
    console.log(leftHour);
    this.setData({
      leftTime: leftHour.toString() + ":" + leftMinute.toString(),
    })
  },
  heighValueChangeAction: function (e) { //改变右滑块
    var rightHour = Math.floor(e.detail.heighValue / 60); //滑块右边的时间
    var rightMinute = e.detail.heighValue % 60; //滑块右边的时间
    this.setData({
      rightTime: rightHour.toString() + ":" + rightMinute.toString()
    })
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

  getMoveableArea: function () {
    //可移动区域的宽度
    // todo
    // 这里的宽度:屏幕宽度; 这里的高度:屏幕高度 - 状态栏高度;
    var windowWidth = App.globalData.screenWidth
    var windowHeight = App.globalData.screenHeight
    // console.log(windowWidth)
    // console.log(windowHeight)
    var areaHeight = windowHeight -77

    // 这里的函数一定要随项目进度更改，目前这样设置是为了减去上面三个单元格的高度
    var areaWidth = windowWidth
    this.setData({
      areaHeight,
      areaWidth
    })
  },
  //以上为有关滑块的函数

  getMoveableArea: function () {
    //可移动区域的宽度
    // todo
    // 这里的宽度:屏幕宽度; 这里的高度:屏幕高度 - 状态栏高度;
    var windowWidth = App.globalData.screenWidth
    var windowHeight = App.globalData.screenHeight
    // console.log(windowWidth)
    // console.log(windowHeight)
    var areaHeight = windowHeight -77

    // 这里的函数一定要随项目进度更改，目前这样设置是为了减去上面三个单元格的高度
    var areaWidth = windowWidth
    this.setData({
      areaHeight,
      areaWidth
    })
  },
//有关滑块的函数
lowValueChangeAction: function (e) {//改变左滑块
  var leftHour=Math.floor(e.detail.lowValue / 60);//滑块左边的小时
  var leftMinute=e.detail.lowValue % 60;//滑块左边的分钟
  console.log(leftHour);
  this.setData({
      leftTime: leftHour.toString() + ":" + leftMinute.toString(),
  })
},
heighValueChangeAction: function (e) {//改变右滑块
  var rightHour=Math.floor(e.detail.heighValue / 60);//滑块右边的时间
  var rightMinute=e.detail.heighValue % 60;//滑块右边的时间
  this.setData({
      rightTime: rightHour.toString()+":"+rightMinute.toString()
  })
},
hideSlider: function (e) {//隐藏滑块
  this.selectComponent("#zy-slider").hide()
  this.selectComponent("#zy-slider1").hide()
},

showSlider: function (e){//显示滑块
  this.selectComponent("#zy-slider").show()
  this.selectComponent("#zy-slider1").show()
},

resetSlider: function (e){//重置滑块
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

  // getIcon: function () {
  //   var that = this
  //   var res = jsonData.dataList
  //   if (res.errorCode == 0) {
  //     that.setData({
  //       seatTypeList: res.seatTypeList,
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoveableArea()
    // this.getIcon()
    this.setData({
      id: options.id,
      name: options.name,
      // startTime: options.startTime,
      // closeTime: options.closeTime,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  onShow: function () {
    var that = this;
    // 数据库设计需要好好看看
    // db.collection('StallUsageRecord').where({

    // })
    db.collection('StallArea').where({
      _id: that.data.id
    }).get({
      success: function (res) {
        var seatList = res.data[0].stallList
        that.setData({
          seatList,
          selectedSeat: [],
          hidden: "hidden"
        })
        //计算X和Y坐标最大值
        that.prosessMaxSeat(seatList);
        //按每排生成座位数组对象
        // that.creatSeatMap()
      }
    })
  },
  // // 根据seatList 生成一个类map的对象 key值为gRow坐标 value值为gRow为key值的数组
  // creatSeatMap: function () {
  //   let seatList = this.data.seatList
  //   var obj = {}
  //   for (let index in seatList) {
  //     let seatRowList = seatList[index].gRow
  //     if (seatRowList in obj) {
  //       // 原本数组下标
  //       seatList[index].orgIndex = index
  //       obj[seatRowList].push(seatList[index])
  //     } else {
  //       let seatArr = []
  //       // 原本数组下标
  //       seatList[index].orgIndex = index
  //       seatArr.push(seatList[index])
  //       obj[seatRowList] = seatArr
  //     }
  //   }
  //   this.setData({
  //     seatMap: obj
  //   })
  // },

  prosessSeatList: function (response) {
    //修改这个地方
    let resSeatList = response
    resSeatList.forEach(element => {
      // 获取座位的类型的首字母
      let firstNumber = element.type.substr(0, 1)
      // 加载座位的图标
      let seatType = this.data.seatTypeList;
      for (const key in seatType) {
        // 加载每个座位的初始图标defautIcon 和 当前图标 nowIcon
        if (element.type === seatType[key].type) {
          element.nowIcon = seatType[key].icon
          element.defautIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-1' === seatType[key].type) {
          element.selectedIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-2' === seatType[key].type) {
          element.soldedIcon = seatType[key].icon
        }
      }
      // 如果座位是已经售出 和 维修座位 加入属性canClick 判断座位是否可以点击
      if (element.defautIcon === element.soldedIcon) {
        element.canClick = false
      } else {
        element.canClick = true
      }
    })
    return resSeatList
  },

  //计算最大座位数,生成影厅图大小
  prosessMaxSeat: function (value) {
    let seatList = value
    let maxY = 0;
    for (let i = 0; i < seatList.length; i++) {
      let tempY = seatList[i].grow;
      if (parseInt(tempY) > parseInt(maxY)) {
        maxY = tempY;
      }
    }
    let maxX = 0;
    for (var i = 0; i < seatList.length; i++) {
      var tempX = seatList[i].gcol;
      if (parseInt(tempX) > parseInt(maxX)) {
        maxX = tempX;
      }
    }
    let seatRealWidth = parseInt(maxX) * 70 * this.data.rpxToPx
    let seatRealheight = parseInt(maxY) * 70 * this.data.rpxToPx
    let seatScale = 1;
    let seatScaleX = 1;
    let seatScaleY = 1;
    let seatAreaWidth = 630 * this.data.rpxToPx
    let seatAreaHeight = this.data.seatArea - 200 * this.data.rpxToPx
    if (seatRealWidth > seatAreaWidth) {
      seatScaleX = seatAreaWidth / seatRealWidth
    }
    if (seatRealheight > seatAreaHeight) {
      seatScaleY = seatAreaHeight / seatRealheight
    }
    if (seatScaleX < 1 || seatScaleY < 1) {
      seatScale = seatScaleX < seatScaleY ? seatScaleX : seatScaleY
    }
    this.setData({
      maxY: parseInt(maxY),
      maxX: parseInt(maxX),
      seatScale: seatScale,
      seatScaleHeight: seatScale * 70 * this.data.rpxToPx
    });
  },


  // 处理已选的座位
  processSelected: function (index) {
    let _selectedSeatList = this.data.selectedSeat
    let seatList = this.data.seatList
    // 改变这些座位的图标为初始图标 并 移除id一样的座位
    seatList[index].nowIcon = seatList[index].defautIcon
    for (const key in _selectedSeatList) {
      if (_selectedSeatList[key].id === seatList[index].id) {
        _selectedSeatList.splice(key, 1)
      }
    }
    this.setData({
      selectedSeat: _selectedSeatList,
      seatList: seatList
    })
  },
  // 处理未选择的座位
  processUnSelected: function (index) {
    let _selectedSeatList = this.data.selectedSeat
    let seatList = this.data.seatList
    // 改变这些座位的图标为已选择图标
    seatList[index].nowIcon = seatList[index].selectedIcon
    if (_selectedSeatList.length != 0) {
      var choosedIndex = _selectedSeatList[0].orgIndex
      seatList[choosedIndex].nowIcon = seatList[choosedIndex].defautIcon
    }

    // 记录 orgIndex属性 是原seatList数组中的下标值
    seatList[index].orgIndex = index
    // 把选择的座位放入到已选座位数组中
    _selectedSeatList.length = 0
    let temp = {
      ...seatList[index]
    }
    _selectedSeatList.push(temp)
    this.setData({
      selectedSeat: _selectedSeatList,
      seatList: seatList,
      hidden: ""
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