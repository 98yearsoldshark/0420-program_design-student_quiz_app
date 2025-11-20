const app = getApp();
const { STORAGE_KEYS } = require('../../constants/index');
const { showToast } = require('../../utils/util');

Page({
  data: {
    userInfo: null,
    isLoggedIn: false
  },
  
  onLoad() {
    this.checkLoginStatus();
  },
  
  onShow() {
    this.checkLoginStatus();
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO);
    const token = wx.getStorageSync(STORAGE_KEYS.TOKEN);
    
    if (userInfo && token) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true
      });
      
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
      app.globalData.isLoggedIn = true;
    } else {
      this.setData({
        userInfo: null,
        isLoggedIn: false
      });
      
      app.globalData.userInfo = null;
      app.globalData.token = null;
      app.globalData.isLoggedIn = false;
    }
  },
  
  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  
  // 跳转到修改密码页面
  goToChangePassword() {
    if (!this.data.isLoggedIn) {
      showToast('请先登录');
      return;
    }
    
    wx.navigateTo({
      url: '/pages/changePassword/changePassword'
    });
  },
  
  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          wx.removeStorageSync(STORAGE_KEYS.TOKEN);
          wx.removeStorageSync(STORAGE_KEYS.USER_INFO);
          
          app.globalData.token = null;
          app.globalData.userInfo = null;
          app.globalData.isLoggedIn = false;
          
          this.setData({
            userInfo: null,
            isLoggedIn: false
          });
          
          showToast('已退出登录');
        }
      }
    });
  }
}); 