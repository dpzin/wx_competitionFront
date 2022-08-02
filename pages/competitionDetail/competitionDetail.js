// pages/competitionDetail/competitionDetail.js
import regeneratorRuntime from '../../utils/runtime.js'
const post=(url,data)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:url,
      method:'POST',
      dataType:'json',
      data:data,
      header:{'content-type': "application/json"},
      success:function(res){
          resolve(res.data)
      },
      fail: function() {
          reject("请求数据失败");
      },
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {},
    detail: {},
    role:"COMMON",
    buttonStr:"立即报名"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'https://www.supboogie.top/bjss/getCompetition',
      method: 'POST',
      data: {id: options.id},
      success: (res) => {
        this.setData({
          detail: res.data.data,
          query: options
        })
      }
    })
    let userInfo = wx.getStorageSync('myUserInfo')
    let data = {
      "competitionId":options.id,
      "openId":userInfo.openId
    }
    post("https://www.supboogie.top/bjss/getRole",data).then((res)=>{
      console.log(res)
      this.role = res.data
      this.convert()
    })
  },
  toSign() {
    wx.navigateTo({
      url: `/pages/sign/sign?id=${this.data.query.id}`,
    })
  },
  convert() {
    if(this.role == "MC") {
      this.buttonStr = "大屏遥控"
    } else if(this.role == "JUDGE") {
      this.buttonStr = "海选打分"
    } else {
      this.buttonStr = "立即报名"
    }
    this.setData({
      buttonStr: this.buttonStr
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