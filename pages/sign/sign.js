// pages/sign/sign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {},
    name: '',
    phone: '',
    result: '',
    projectsList: [],
    price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'https://www.supboogie.top/bjss/listCompetitionProject',
      method: 'POST',
      data: {competitionId: options.id},
      success: (res) => {
        this.setData({
          projectsList: res.data.data,
          query: options
        })
      }
    })
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value,
    })
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  projectChange(e){
    const projects_id = e.detail.value;
    let { projectsList } = this.data;
    this.data.price = 0;
    if (projects_id.length > 0) {
      projects_id.map(item => {
        const target = projectsList.find(v => v.id === item)
        if (target) {
          return this.setData({
            price: this.data.price + target.price*100,
          })
        }
      })
    } else {
      this.setData({
        price: 0,
      })
    }
  },
  onSubmit(e){
    console.log(e)
    const { name, phone, price} = this.data
    if (!name) {
      return wx.showToast({
        title: '请输入姓名！',
        icon: "none", 
        duration: 2000
      })
    } else if (!phone) {
      return wx.showToast({
        title: '请输入手机号！',
        icon: "none", 
        duration: 2000
      })
    } else if (phone) {
      const regex = "1[3-9]\\d{9}"
      const phone = e.detail.value
      if(!(/^1[34578]\d{9}$/.test(phone))) {
        return wx.showToast({
          title: '请输入正确的手机号！',
          icon: 'none', 
          duration: 2000
        })
      }
    }else if (price === 0) {
      return wx.showToast({
        title: '请选择参赛项目！',
        icon: "none", 
        duration: 2000
      })
    }
    this.getOpenId()
    this.createOrderAndPay()
  },
  //获取openId
   async getOpenId(cod) {
    let openId = ""
    await wx.request({
      url: 'https://www.supboogie.top/bjss/wx/getOpenId',
      method: 'POST',
      data: {
        "code":cod
      },
      success: (res)=> {
        openId = res.data.data.openid
      }
    })
    return openId;
  },
  //下单支付
  createOrderAndPay(order) {
    wx.request({
      url: 'https://www.supboogie.top/bjss/createOrder',
      method: 'POST',
      data: {
        "openId": order.openId,
        "productTypeEnum": "ENTRY_FEE",
        "productIds": order.productIds,
        "competitionId": order.competitionId
      },
      success: (res) => {
        this.pay(res.data.data)
      }
    })
  },
  //支付用
  pay(data) {
    wx.requestPayment({
    "timeStamp": data.timeStamp.toString(),
    "nonceStr": data.nonceStr,
    "package": "prepay_id="+data.package,
    "signType": "RSA",
    "paySign": data.paySign,
    "success":function(res){
      console.log(res)
    },
    "fail":function(res){
      console.log(res)
    }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})