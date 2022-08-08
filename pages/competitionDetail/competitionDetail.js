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
    roleDetail: {},
    role:"COMMON",
    buttonStr:"",
    competitionId:"",
    btnDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('myUserInfo')
    let data = {
      "competitionId":options.id,
      "openId":userInfo.openId
    }
    this.competitionId = options.id
    post("https://www.supboogie.top/bjss/getRole",data).then((res)=>{
      this.roleDetail = res.data.roleDetail
      this.role = res.data.role
      wx.request({
        url: 'https://www.supboogie.top/bjss/getCompetition',
        method: 'POST',
        data: {id: options.id},
        success: (res) => {
          this.setData({
            detail: res.data.data,
            query: options,
            btnDisabled: res.data.data.status === '0' || res.data.data.status=== '3' ? true : false
          })
          this.convert()
        }
      })
    })
  },
  toSign() {
    if(!this.data.btnDisabled && this.role == "COMMON") {
      wx.navigateTo({
        url: `/pages/sign/sign?id=${this.data.query.id}`,
      })
    }
    if(!this.data.btnDisabled && this.role ==  "MC") {
      wx.navigateTo({
        url: `/pages/controller/controller?competitionId=${this.competitionId}`,
      })
    }
  },
  convert() {
    if(this.role == "MC") {
      this.buttonStr = "大屏遥控"
    } else if(this.role == "JUDGE") {
      this.buttonStr = "海选打分"
    } else if (this.data.detail.status === '0') {
      this.buttonStr = "报名未开始"
    } else if (this.data.detail.status === '3') {
      this.buttonStr = "报名已结束"
    } else {
      this.buttonStr = '立即报名'
    }
    this.setData({
      buttonStr: this.buttonStr
    })
  },
  previewImage(e) {
    wx.previewImage({
      urls: ['https://www.supboogie.top/image/competition/cf752640-131a-4d82-82a2-6dd6325eaa3c.png'],
      current: e.target.dataset.src
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

  },
  onShareTimeline() {
    return {
      title:this.data.detail.name+"(参赛报名)",
      imageUrl:"../../images/nianshaoyouwei.jpg"
    }
  }
})