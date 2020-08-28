import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const db = wx.cloud.database()
//对云数据库的链接
Page({
  /**
   * 页面的初始数据
   */
  data: {
    steps: [{
        text: '步骤一',
        desc: '阅读条款',
      },
      {
        text: '步骤二',
        desc: '信息填写',
      },
      {
        text: '步骤三',
        desc: '提交申请',
      },
    ],
    active: 0,
    isDisabled: true,
    checked: false,
    name: "",
    brand: "",
    //存储用户输入的品牌数据
    type: "",
    //用户选择的品牌数据
    sex: "",
    //用户输入的性别
    idcard: "",
    //身份证号
    tel: "",
    //联系方式
    showType: false,
    columns: ['食品类', '服装类', '图书类', '手工艺品类', '农产品类', '娱乐消遣类'],
    activeNames: ['1'],
    BrandError: "",
    NameError: "",
    IDError: "",
    TELError: "",
    showSex: false,
    sexSelect: ["男", "女", ],
    submitShow: false,
    applyId: "",
    //通过id判断是提交申请还是修改申请
    area: "",
    manageID: "",
    score: 0
  },
  brand: function (res) {
    //console.log(res.detail)
    this.data.brand = res.detail
    if (res.detail.length != 0 && this.data.BrandError.length != 0) {
      this.setData({
        BrandError: ""
      })
    }
  },
  name: function (res) {
    this.data.name = res.detail
    if (res.detail.length != 0 && this.data.NameError.length != 0) {
      this.setData({
        NameError: ""
      })
    }
    //console.log(res.detail)
  },

  //性别选择的函数
  selectSex: function (res) {
    var that = this
    console.log(res.detail)
    that.setData({
      sex: res.detail.value,
      showSex: false
    })
  },
  showSex: function () {
    var that = this
    that.setData({
      showSex: true
    })
  },
  closeSex: function () {
    var that = this
    that.setData({
      showSex: false
    })
  },

  ID: function (res) {
    this.data.idcard = res.detail
    if (res.detail.length == 18 && this.data.IDError.length != 0)
      this.setData({
        IDError: ""
      })
    //  console.log(res.detail.length)
  },
  TEL: function (res) {
    this.data.tel = res.detail
    if (res.detail.length == 11 && this.data.TELError.length != 0) {
      this.setData({
        TELError: ""
      })
    }
    //  console.log(res.detail.length)
  },
  open: function (res) {
    this.setData({
      activeNames: res.detail,
    });
  },
  selectType: function (res) {
    var that = this
    //console.log(res.detail)
    that.setData({
      type: res.detail.value,
      showType: false
    })
  },
  showType: function () {
    var that = this
    that.setData({
      showType: true
    })
  },
  closeType: function () {
    var that = this
    that.setData({
      showType: false
    })
  },
  //阅读完政策文件之后的信息
  //此函数在选中复选框之后点击下一页时执行
  change: function () {
    //查询数据库中对应用户的状态
    var that = this
    db.collection('apply')
      .where({
        _openid: wx.getStorageSync('openid')
      })
      .get({
        success(res) {
          //todo 用户可以多次提交和修改信息，如何判断用户提交的最终版本的信息
          if (res.data.length == 0) {
            //console.log("执行了")
            that.setData({
              active: 1
            })
          } else {
            that.setData({
              submitShow: true
            })
          }
        },
        fail() {
          console.log("当前用户没有提交过申请或请求数据失败")
        }
      })
  },
  //点击对话框确认按钮并返回之后的结果
  submitShow: function () {
    this.setData({
      submitShow: false,
      active: 0
    })
    wx.navigateBack({
      delta: 1
    });
  },
  apply: function () {
    var that = this
    if (that.data.brand == "") {
      that.setData({
        BrandError: "品牌名称不能为空"
      })
    } else if (that.data.name == "") {
      that.setData({
        NameError: "姓名不能为空"
      })
    } else if (that.data.idcard == "") {
      that.setData({
        IDError: "身份证号不能为空"
      })
    } else if (that.data.tel == "") {
      that.setData({
        TELError: "联系方式不能为空"
      })
    } else if (that.data.idcard.length != 18) {
      that.setData({
        IDError: "请输入18位有效身份证"
      })
    } else if (that.data.tel.length != 11) {
      that.setData({
        TELError: "请输入11位有效电话号"
      })
    } else {
      if (that.data.applyId != "") {
        //console.log(that.data.applyId)
        //修改申请
        db.collection('apply').where({
          _id: that.data.applyId
        }).update({
          data: {
            newest: 0
          }
        })
      }
      //如果提交成功的话执行数据库的存储
      db.collection('apply').add({
        data: {
          brand: this.data.brand,
          type: this.data.type,
          score: this.data.score,
          manageID: this.data.manageID,
          area: this.data.area,
          principal: {
            name: this.data.name,
            sex: this.data.sex,
            idcard: this.data.idcard,
            tel: this.data.tel
          },
          newest: 1,
          //添加newest表示最新的提交
          condition: "0",
          createTime: db.serverDate(),
          remark: "无备注"
        },
        success: function () {
          that.setData({
            active: 2
          })
          Dialog.alert({
            title: '提交申请',
            message: '您的申请已提交，将于3-5个工作日之内给予回复',
          }).then(() => {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            console.log(prevPage)
            prevPage.refresh() //刷新方法
            wx.navigateBack({
              delta: 1
            })
            that.setData({
              active: 0
            })
          })
        },
        fail: function () {
          console.log("添加数据失败")
        }
      })
    }


  },
  onChange: function (res) {
    var that = this
    if (res.detail) {
      that.setData({
        checked: true,
        isDisabled: false
      })
    } else {
      that.setData({
        checked: false,
        isDisabled: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    if (options.length != 0) {
      that.setData({
        // url传参，直接填充
        active: options.active,
        brand: options.brand,
        type: options.type,
        name: options.name,
        tel: options.tel,
        idcard: options.idcard,
        sex: options.sex,
        applyId: options.id
      })
    }
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

  }
})