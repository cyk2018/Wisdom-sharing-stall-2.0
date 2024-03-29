// pages/reserve/reserve.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    scale: 15,
    markers: [],
    // show: false,
    placeholder: "请输入地址"
  },
  startReserve: function (res) {
    var marker = this.data.markers[res]
    wx.navigateTo({
      url: '/pages/startReserve/startReserve?id=' + marker._id + '&name=' + marker.name + '&startTime=' +
        marker.startTime + '&closeTime=' +
        marker.endTime,
      success: function () {
        console.log("页面跳转成功")
      },
      fail: function () {
        console.log("页面跳转失败")
      }
    })
  },
  getLocation: function (res) {
    console.log(res.detail.latitude)
    console.log(res.detail.longitude)
  },


  // onChangeSearch: function (res) {

  //   console.log(res)
  //   //this.data.address = res
  // },
  // onSearchAddress: function () {

  // },


  // 这个同层渲染在模拟器上有问题，真机上没问题
  onFocus: function (res) {
    // console.log(res)
    // console.log("点到了")
    this.setData({
      latitude: this.data.latitude,
      longitude: this.data.longitude
    })
  },
  // // 控制地图缩放级别
  // onIncreaseScale() {
  //   let scale = this.data.scale;
  //   if (scale === 20) {
  //     return;
  //   }
  //   scale++;
  //   this.setData({
  //     scale: scale
  //   });
  // },
  // onDecreaseScale() {
  //   let scale = this.data.scale;
  //   if (scale === 3) {
  //     return;
  //   }
  //   scale--;
  //   this.setData({
  //     scale: scale
  //   });
  // },
  // postAddress: function () {
  //   var that = this
  //   wx.getSetting({
  //     success(res) {
  //       if (!res.authSetting['scope.userLocation']) {
  //         wx.openSetting({
  //           success: function (res) {
  //             if (res.authSetting['scope.userLocation']) {
  //               this.getAddress()
  //             } else {

  //             }
  //           }
  //         })
  //       } else {
  //         this.getAddress()
  //       }
  //     }
  //   })
  // },
  //如果成功的话就获得用户地理位置
  getAddress: function () {
    var that = this
    wx.getLocation({
      //获得当前用户的经纬度信息
      //小程序要求数据格式
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 4000,
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          // tempLatitude: res.latitude,
          // tempLongitude: res.longitude
        })
      }
    })
  },
  getStallLocation: function () {
    // 根据 startTime 和 endTime 查询当前的数据库获得标记信息
    var that = this
    const _ = db.command
    // 这里面临着一个问题，就是如何根据用户设定的开始和结束时间搜索数据库获得当前可供摆摊的区域，需要在数据库架构上进行调整
    // db.collection('StallArea').where({

    // })

    //展示当前所有的标记和气泡
    var that = this
    db.collection('StallArea').get({
      success: function (res) {
        // console.log(res)
        var markers = res.data
        var customCalloutMarkerIds = []
        markers.forEach(function (item, index) {
          item.customCallout = {
              anchorX: 0,
              anchorY: 0,
              display: "ALWAYS"
            },
            item.id = index,
            customCalloutMarkerIds.push(index)
          item.latitude = item.coordinat.latitude,
            item.longitude = item.coordinat.longitude
        })
        that.setData({
          markers,
          customCalloutMarkerIds
        })
      },
      fail: function () {
        console.log("数据库查询失败")
      }
    })
  },
  showDetail: function (res) {
    console.log(res)
    this.startReserve(res.detail.markerId)
  },

  // 点击遮罩层调用此函数
  onClickHide: function () {
    console.log("执行到这了")
    this.setData({
      show: false,
    })
    setTimeout(() => {
      this.setData({
        placeholder: "请输入地址"
      })
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // // this.setData({
    // //   startReserveTime: options.startTime,
    // //   endReserveTime: options.endTime
    // // })
    this.getStallLocation()
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
    this.getAddress()
    this.onFocus()
    this.getUserLocation()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1
      });
    }
  },

  getUserLocation: function () {

    var _this = this;

    wx.getSetting({

      success: (res) => {

        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面

        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权

        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权

        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {

          //未授权

          wx.showModal({

            title: '请求授权当前位置',

            content: '需要获取您的地理位置，请确认授权',

            success: function (res) {

              if (res.cancel) {

                //取消授权

                wx.showToast({

                  title: '拒绝授权',

                  icon: 'none',

                  duration: 1000

                })
                wx.switchTab({
                  url: '/pages/apply/apply',
                })

              } else if (res.confirm) {

                //确定授权，通过wx.openSetting发起授权请求

                wx.openSetting({

                  success: function (res) {

                    if (res.authSetting["scope.userLocation"] == true) {

                      wx.showToast({

                        title: '授权成功',

                        icon: 'success',

                        duration: 1000

                      })

                      //再次授权，调用wx.getLocation的API

                      _this.geo();

                    } else {

                      wx.showToast({

                        title: '授权失败',

                        icon: 'none',

                        duration: 1000

                      })

                    }

                  }

                })

              }

            }

          })

        } else if (res.authSetting['scope.userLocation'] == undefined) {

          //用户首次进入页面,调用wx.getLocation的API

          _this.getAddress()

        } else {

          console.log('授权成功')

          //调用wx.getLocation的API

          _this.getAddress()

        }

      }

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