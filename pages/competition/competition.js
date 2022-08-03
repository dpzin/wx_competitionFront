// pages/competition/competition.js
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
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getList()
  },
  async getList(cb) {
    await wx.request({
      url: 'https://www.supboogie.top/bjss/listCompetition',
      method: 'POST',
      data: {},
      success: (res) => {
        this.setData({
          list: res.data.data
        })
      },
      complete: () => {
        cb && cb()
      }
    })
  },
  toDetail(event) {
    var userInfo = wx.getStorageSync("myUserInfo")
    if(!userInfo) {
      this.getUserInfo(event)
    } else {
      wx.navigateTo({
        url: `/pages/competitionDetail/competitionDetail?id=${event.currentTarget.dataset.id}`,
      })
    }
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
    this.getList(() => {
      wx.stopPullDownRefresh()
    })
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

  },
  getOpenId() {
    return new Promise((resolve)=>{
      wx.login({
        success: (res) => {
          wx.request({
            url: 'https://www.supboogie.top/bjss/wx/getOpenId',
            method: 'POST',
            data: {
              "code": res.code
            },
            success: (res) => {
              const openId = res.data.data.openid
              resolve(openId)
            }
          })
        }
      })
    })
  },
  getUserInfoProfile() {
    return new Promise((resolve,reject)=>{
      wx.getUserProfile({
        desc: '使用小程序内的功能及服务',
        success: (res) => {
          let userInfo = {
            "nickName": res.userInfo.nickName,
            "gender": res.userInfo.gender,
            "avatarUrl": res.userInfo.avatarUrl,
            "role": "COMMON"
          }
          resolve(userInfo)
        },
        fail: (res) => {
          reject(res)
        }
      })
    })
  },
  async getUserInfo(event) {
      let userInfo = wx.getStorageSync('myUserInfo')
      if(userInfo) {
        wx.navigateTo({
          url: `/pages/competitionDetail/competitionDetail?id=${event.currentTarget.dataset.id}`,
        })
      } else {
        let userInfo = await this.getUserInfoProfile().then((res)=>{
          return res;
        });
        if(!userInfo) {
          return
        }
        let openId = await this.getOpenId().then((res)=>{ return res})
        userInfo.openId = openId
        wx.setStorageSync('myUserInfo', userInfo)
        wx.navigateTo({
          url: `/pages/competitionDetail/competitionDetail?id=${event.currentTarget.dataset.id}`,
        })
      }
    }
})
