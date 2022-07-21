// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {

  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(123)
    wx.login({
      success (res) {
        console.log(res)
      }
    })
    wx.request({
      url: 'https://www.supboogie.top/bjss/listCompetition',
      method: 'POST',
      data: {

      },
      success (res) {
        console.log(res.data)
      }
    })
    // 微信支付下单
    // wx.request({
    //   url: 'https://www.supboogie.top/bjss/createOrder',
    //   method: 'POST',
    //   data: {
    //     "openId":"o-T0A5pcEnNOciFf2Lco1evFvCdw",
    //     "productTypeEnum":"ENTRY_FEE",
    //     "productIds":["2c9abe3f7fc1d0af017fc1d8eaa30008"]
    //   },
    //   success: (res)=> {
    //     console.log(res.data)
    //     //this.pay(res.data.data)
    //   }
    // })
  },
  pay(data) {
    console.log("---",data)
    var request = {

    }
    wx.requestPayment({
		"timeStamp": data.timeStamp.toString(),
		"nonceStr": data.nonceStr,
		"package": "prepay_id="+data.package,
		"signType": "RSA",
		"paySign": data.paySign,
		"success":function(res){
      console.log(res)
    },
		"fail":function(res){
      console.log(res)
    },
		"complete":function(res){
      console.log(res)
    }
	  })
  },
  toDetail() {
    console.log(123)
  },
  getUserProfile() {
    console.log(123)
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  }
})
