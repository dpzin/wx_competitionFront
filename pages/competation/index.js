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
    wx.request({
      url: '127.0.0.1/bjss/listCompetition',
      method: 'POST',
      success (res) {
        console.log(res.data)
      }
    })
  },
  toDetail() {
    console.log(123)
  }
})
