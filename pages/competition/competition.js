// pages/competition/competition.js
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
  onLoad(options) {
    this.getList()
  },
  getList(cb) {
    wx.request({
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
  getUserInfo() {
    let flag = false;
    var userInfo = wx.getStorageSync("myUserInfo")
    if(!userInfo) {
      wx.getUserProfile({
        desc: '使用小程序内的功能及服务',
        success: (res) => {
          flag = true;
          console.log(res)
          // this.setData({
          //   userInfo: res.userInfo,
          //   hasUserInfo: true
          // })
        },
        fail: (res)=> {
          console.log(res)
        }
      })
    }
    console.log(333)
   return flag;
  },
  toDetail(event) {
    wx.clearStorage({
      success: (res) => {},
    })
    var userInfo = wx.getStorageSync("myUserInfo")
    if(!userInfo) {
      wx.getUserProfile({
        desc: '使用小程序内的功能及服务',
        success: (res) => {
          debugger
          wx.setStorageSync('myUserInfo', res.userInfo)
          console.log(res)
          let userInfo = {
            "nickName": res.userInfo.nickName,
            "gender": res.userInfo.gender,
            "avatarUrl": res.userInfo.avatarUrl,
            "role":"common"
          }
          //获取openId
          wx.login({
            success: async(res) => {
              wx.request({
                url: 'https://www.supboogie.top/bjss/wx/getOpenId',
                method: 'POST',
                data: {
                  "code": res.code
                },
                success: (res)=> {
                  const openId = res.data.data.openid
                  userInfo.openId = openId
                  this.addOrUpdateWxUser(userInfo)
                }
              })
            }
          })
          wx.navigateTo({
            url: `/pages/competitionDetail/competitionDetail?id=${event.currentTarget.dataset.id}`,
          })
        },
        fail: (res)=> {
          console.log(res)
        }
      })
    } else {
      wx.navigateTo({
        url: `/pages/competitionDetail/competitionDetail?id=${event.currentTarget.dataset.id}`,
      })
    }
  },
  
  addOrUpdateWxUser(userInfo) {
    wx.request({
      url: 'https://www.supboogie.top/bjss/addOrUpdateWXUser',
      method: "POST",
      data: userInfo
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

  }
})