
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    manageIDforUser: "",
    Reserved: false
  },
  // insert: function () {
  //   //禁用按钮
  //   wx.showLoading({
  //     title: '数据请求中',
  //   })
  //   db.collection('myReserve').add({
  //     data: {
  //       start_time: "3:00",
  //       close_time: "5:00"
  //     },
  //     success:function(){
  //       wx.hideLoading({
  //         success: (res) => {},
  //       })
  //     },
  //     fail:function(){
  //       console.log("添加数据失败")
  //     },
  //     complete:function(){
  //       //取消禁用
  //     }
  //   })
  // },
  setNavigationBar: function () {
    wx.setNavigationBarTitle({
      title: '我的预约',
    })
  },
  getManageID: function(){//获取经营号，以便查询预约
    var that = this
    db.collection('apply')  
      .where({
        _openid: wx.getStorageSync('openid'),
       condition: "1"
      })
      .get({
        success: function(res) {
          console.log('res' + res.data[0].manageID);
          that.setData({
            manageIDforUser: res.data[0].manageID
          })
    },
        fail: function(res) {
          console.log("获取经营号失败");
        }
      })
  },
  getReserve: function () {//获取预约
    var that = this
    db.collection('Reservation').where({
      manageID: that.data.manageIDforUser
    }).get({
      success: function (res) {
        var length = res.data.length
        var data = res.data.reverse()
        console.log(data);
        for (var i = 0; i < length; i++) {
              data[i].startTime = data[i].startTime.toLocaleString()
              data[i].endTime = data[i].endTime.toLocaleString()
              data[i].submitTime = data[i].submitTime.toLocaleString()
        }
        console.log(data);
        that.setData({
          data: data,
          Reserved: true
        })
      }
    })
  },
  // search: function(){
  //   this.getManageID();
  //   setTimeout(() => {
  //     this.getReserve();
  //     } 
  //   , 1500)
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.showLoading({ //弹出框显示内容，当出现hideloading时消失
      title: '加载中',
    })
    that.setNavigationBar();
    that.getManageID();
    setTimeout(() => {
      that.getReserve();
      } 
    , 1500)
    setTimeout(() => {
      wx.hideLoading();
      if (that.data.Reserved==false) {
        Notify({
          type: 'warning',
          message: '当前无预约信息'
        })

      } 
    }, 3000)
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

  },
  cancelReserve: function (event) {
    console.log(event.currentTarget.dataset.index);
    var index = event.currentTarget.dataset.index;
    Dialog.confirm({
      message: '是否确认取消预约（不可撤销）'
    })
      .then(() => {
        // on confirm
        var id = this.data.data[index]._id
        db.collection('Reservation').doc(id).remove({
          success: function (res) {
                console.log("删除成功");
          },
          fail: function(res){
            console.log("删除失败");
          }
        })
        //重新加载
        this.onLoad();
      })
      .catch(() => {
        // on cancel
      });
  }
})
