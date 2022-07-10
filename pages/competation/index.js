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
  },
  toDetail() {
    console.log(123)
  }
})
