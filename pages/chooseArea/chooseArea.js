const db = wx.cloud.database()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
Page({
  data: {
    show: false,
    // show 控制弹出的选择框
    buttonTitle: "确认发布",
    name: "",
    address: "",
    start_time: "",
    close_time: "",
    max_number: "",
    // 这些初值的存在是为了便于后面的非空判断
    buttonShow: false,
    //控制保存按钮的弹出

    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 30 === 0);
      }
      return options;
    },
  },

  checkNotNull: function () {
    if (this.data.name != "" && this.data.address != "" && this.data.start_time != "" && this.data.close_time != "" && this.data.max_number != "") {
      this.setData({
        buttonShow: true
      })
    } else if (this.data.buttonShow) {
      this.setData({
        buttonShow: false
      })
    }
  },

  onMaxNumberChange: function (res) {
    this.data.max_number = res.detail
    this.checkNotNull()
  },
  loading: function () {
    //按钮禁用，防止重复点击
    this.setData({
      checkButton: true
    })
    wx.showLoading({
      title: '数据上传中',
    })
  },
  confirmChange: function () {
    var that = this
    that.loading()
    db.collection('StallArea').where({
      _id: that.data._id
      // 此值是根据提出修改的页面传入的id来判断
    }).update({
      data: {
        name: that.data.name,
        address: that.data.address,
        startTime: that.data.start_time,
        endTime: that.data.close_time,
        stallNum: that.data.max_number,
      },
      success: function () {
        wx.hideLoading({
          success: (res) => {
            Toast.success({
              message: "修改成功"
            })
          },
        })
        wx.navigateBack({
          delta: 0,
          success: function () {
            Toast.clear()
          }
        })
      },
      fail: function () {
        wx.hideLoading({
          success: (res) => {
            Toast.fail({
              message: "修改失败"
            })
          },
        })
      },

    })
  },

  confirmSeat: function () {
    // 添加新的摆摊区域，后期要确保同一个地点不允许有两个相同的区域
    var that = this
    that.loading()
    var seat = {
      grow: 0,
      gcol: 0,
      icon: "../../images/image_can_select_click.png"
    }
    var seatRowList = []
    seatRowList.push(seat)
    // console.log(seatRowList)
    var seatList = []
    seatList.push(seatRowList)
    db.collection('StallArea').add({
      data: {
        name: that.data.name,
        address: that.data.address,
        coordinat: {
          latitude: that.data.latitude,
          longitude: that.data.longitude
        },
        startTime: that.data.start_time,
        endTime: that.data.close_time,
        stallNum: that.data.max_number,
        stallList: seatList,
        rowNum: 1,
        columnNum: 1
      },
      success: function () {
        wx.hideLoading({
          success: (res) => {
            wx.navigateTo({
              url: '/pages/adminApply/adminApply',
            })
          },
        })
        wx.showLoading({
          title: '数据库部署中',
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  onChange: function (res) {
    this.data.name = res.detail
    this.checkNotNull()
  },

  cancelTime: function () {
    this.setData({
      show: false
    })
  },

  chooseTime: function (res) {
    var that = this
    var id = res.currentTarget.id
    var title = ""
    var choose = 0
    if (id == "start") {
      title = "请选择开市时间"
      choose = 1
    } else {
      title = "请选择闭市时间"
      choose = 2
    }
    if (choose == 2 && that.data.start_time.length == 0) {
      wx.showToast({
        title: '未设置开市时间',
        icon: 'none'
      })
    } else {
      that.setData({
        show: true,
        nowTitle: title,
        choose: choose
      })
    }
  },

  confirmTime: function (res) {
    console.log(res)
    var that = this
    if (that.data.choose == 1) {
      that.setData({
        show: false,
        start_time: res.detail,
        //currentDate: res.detail
      })
    }
    //&& that.data.startReserveTime.length > 0
    if (that.data.choose == 2) {
      that.setData({
        show: false,
        close_time: res.detail,
      })
    }
    this.checkNotNull()
  },


  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name
        });
      }
    });
    this.checkNotNull()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //这里判断是新增摆摊区域还是修改现有的区域
    var check = false
    for (let key in options) {
      check = true
    }
    if (check) {
      this.setData({
        name: options.name,
        address: options.address,
        start_time: options.start_time,
        close_time: options.close_time,
        max_number: options.max_number,
        _id: options._id,
        _openid: options._openid,
        buttonShow: true,
        buttonTitle: "保存修改"
      })
    }
    this.setData({
      checkCondition: check
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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