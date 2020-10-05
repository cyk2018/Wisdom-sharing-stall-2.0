import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    applyed: false,
    //系统默认值设为true
    //是否提交过申请
    reapply: false
  },
  showApply: function (res) {
    console.log(res)
    var that = this
    //判断是否展开
    if (res.detail.length == 2) {
      //console.log("展开面板")
      that.search()
      //异步赋值
      setTimeout(() => {
        wx.hideLoading();
        if (that.data.applyed) {
          that.setData({
            activeNames: res.detail,
          });

        } else {
          Notify({
            type: 'warning',
            message: '当前尚未收到申请,请重试'
          })
        }
      }, 1000)
    } else {
      //此处主要是如果搜到数据而且展开面板之后可以调用这里折叠面板
      that.setData({
        activeNames: res.detail,
      });
    }
  },

  refresh: function (res) {
    this.search()
  },

  //获取申请数据并更新
  search: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })

    db.collection('apply').where({
      _openid: that.data.openid
    }).get({
      success: function (res) {
        console.log(res)
        var length = res.data.length
        if (length == 0) {
          that.setData({
            applyed: false
          })
        } else {
          if (res.data[length - 1].condition == -1) {
            that.setData({
              reapply: true
            })
          } else {
            that.setData({
              reapply: false
            })
          }

          //将申请数组倒序列展示
          var data = res.data.reverse()

          for (var i = 0; i < length; i++) {
            switch (data[i].condition) {
              case "-1":
                //判断最新一次提交的状态
                data[i].condition = "申请失败"

                break;
              case "0":
                data[i].condition = "已提交"
                break;
              case "1":
                data[i].condition = "申请成功"
                break;
            }
          }
          that.setData({
            applyed: true,
            data: data
          })

        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '资质申请',
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      activeNames: ['1']
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 0
      });
    }

    //console.log("onShow")
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

  },
  // 通过event事件监听和data-xxx传参，把索引值index传入（对应data中的第几个）
  gotoPage: function (event) {
    console.log(event.currentTarget.dataset.index);
    var index = event.currentTarget.dataset.index;
    // console.log(this.data.data);
    // 这里使用this.data.data的原因是setData的时候，更新了数组结构
    wx.navigateTo({
      url: '/pages/message/message?brand=' + this.data.data[index].brand + '&type=' + this.data.data[index].type + '&name=' + this.data.data[index].principal.name + '&idcard=' + this.data.data[index].principal.idcard + '&tel=' + this.data.data[index].principal.tel + '&createTime=' + this.data.data[index].createTime.toLocaleString() + '&condition=' + this.data.data[index].condition + '&remarks=' + this.data.data[index].remark
    })
  },
  // 与gotoPage函数同理,用于用户修改申请
  gotoPage2: function (event) {
    var index = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/index/index?active=1&brand=' + this.data.data[index].brand + '&type=' + this.data.data[index].type + '&name=' + this.data.data[index].principal.name + '&idcard=' + this.data.data[index].principal.idcard + '&tel=' + this.data.data[index].principal.tel + '&createTime=' + this.data.data[index].createTime.toLocaleString() + '&condition=' + this.data.data[index].condition + '&remarks=' + this.data.data[index].remarks + '&sex=' + this.data.data[index].principal.sex + '&id=' + this.data.data[0]._id
      //此处传入的id始终为最新的id
    })
  }
})