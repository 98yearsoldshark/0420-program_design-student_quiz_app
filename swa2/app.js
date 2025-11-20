// app.js
import "./extra/mhchem";

App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'http://localhost:3001', // 替换为实际API地址
    isLoggedIn: false
  },
  
  onLaunch: function() {
    // 检查用户登录状态
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.isLoggedIn = true;
    }
  },
  
  // 通用请求方法
  request: function(options) {
    const { url, method, data, needToken = true } = options;
    
    return new Promise((resolve, reject) => {
      let header = {
        'Content-Type': 'application/json'
      };
      
      if (needToken && this.globalData.token) {
        header['Authorization'] = 'Bearer ' + this.globalData.token;
      }
      
      wx.request({
        url: this.globalData.baseUrl + url,
        method: method || 'GET',
        data: data,
        header: header,
        success: function(res) {
          if (res.statusCode === 401) {
            // 登录失效，清除登录信息
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.navigateTo({
              url: '/pages/login/login'
            });
            reject('登录已过期，请重新登录');
          } else {
            resolve(res.data);
          }
        },
        fail: function(err) {
          reject(err);
        }
      });
    });
  }
})
