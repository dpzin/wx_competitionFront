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
    selectedProjects: [],
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
    this.setData({
      selectedProjects: projects_id,
    })
  },
  async onSubmit(e){
    const { name, phone, price, selectedProjects,query} = this.data
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
            let order = {
              "openId":openId,
              "productIds": selectedProjects, //赛事项目Id
              "competitionId": query.id,
              "name": name,
              "telephone": phone
            }
            this.createOrderAndPay(order)
          }
        })
      }
    })
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
        "competitionId": order.competitionId,
        "name": order.name,
        "telephone": order.telephone
      },
      success: (res) => {
        console.log(res)
        if(res.statusCode == 200) {
          this.pay(res.data.data)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'error'
          })
        }
      },
      fail: (res) => {
        console.log(2,res)
        wx.showToast({
          title: res.data.message,
        })
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
      "success": (res) => {
        this.data.selectedProjects.map(item => {
          wx.request({
            url: 'https://www.supboogie.top/bjss/createCompetitionMember',
            method: 'POST',
            data: {
              name: this.data.name,
              role:'common',
              competitionProjectId: item
            },
            success: () => {
              wx.showModal({
                content: `恭喜${this.data.name}报名成功`,
                showCancel: false,
                success: (res) => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/competition/competition',
                    })
                  }
                }
              })
            }
          })
        })
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