const app = getApp();
const { userApi } = require('../../service/api');
const { isValidEmail, showToast, showLoading, hideLoading } = require('../../utils/util');
const { VALIDATION_RULES, STORAGE_KEYS } = require('../../constants/index');

Page({
  data: {
    email: '',
    password: '',
    rememberLogin: true,
    isLoading: false,
    emailError: '',
    passwordError: ''
  },
  
  onLoad(options) {
    // 从本地存储读取记住的登录信息
    const rememberLogin = wx.getStorageSync(STORAGE_KEYS.REMEMBER_LOGIN);
    if (rememberLogin) {
      const email = wx.getStorageSync('rememberedEmail');
      if (email) {
        this.setData({ email, rememberLogin: true });
      }
    }
  },
  
  // 处理邮箱输入
  handleEmailInput(e) {
    this.setData({
      email: e.detail.value,
      emailError: ''
    });
  },
  
  // 处理密码输入
  handlePasswordInput(e) {
    this.setData({
      password: e.detail.value,
      passwordError: ''
    });
  },
  
  // 处理记住登录状态切换
  handleRememberChange(e) {
    this.setData({
      rememberLogin: e.detail.value
    });
    wx.setStorageSync(STORAGE_KEYS.REMEMBER_LOGIN, e.detail.value);
  },
  
  // 验证表单
  validateForm() {
    let isValid = true;
    
    // 验证邮箱
    if (!this.data.email.trim()) {
      this.setData({
        emailError: VALIDATION_RULES.EMAIL.REQUIRED
      });
      isValid = false;
    } else if (!isValidEmail(this.data.email)) {
      this.setData({
        emailError: VALIDATION_RULES.EMAIL.FORMAT
      });
      isValid = false;
    }
    
    // 验证密码
    if (!this.data.password.trim()) {
      this.setData({
        passwordError: VALIDATION_RULES.PASSWORD.REQUIRED
      });
      isValid = false;
    }
    
    return isValid;
  },
  
  // 处理登录
  handleLogin() {
    if (!this.validateForm()) return;
    
    this.setData({ isLoading: true });
    showLoading('登录中');
    
    const { email, password, rememberLogin } = this.data;
    
    userApi.login({ email, password })
      .then(res => {
        hideLoading();
        this.setData({ isLoading: false });
        
        // 保存登录状态
        app.globalData.token = res.token;
        app.globalData.userInfo = res.user;
        app.globalData.isLoggedIn = true;
        
        // 存储token和用户信息
        wx.setStorageSync(STORAGE_KEYS.TOKEN, res.token);
        wx.setStorageSync(STORAGE_KEYS.USER_INFO, res.user);
        
        // 如果记住登录状态，保存邮箱
        if (rememberLogin) {
          wx.setStorageSync('rememberedEmail', email);
        } else {
          wx.removeStorageSync('rememberedEmail');
        }
        
        showToast('登录成功', 'success');
        
        // 跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      })
      .catch(err => {
        hideLoading();
        this.setData({ isLoading: false });
        
        if (err.statusCode === 401) {
          showToast('用户不存在或密码错误');
        } else {
          showToast('登录失败，请稍后重试');
        }
        console.error('登录失败:', err);
      });
  },
  
  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  
  // 当页面卸载时，确保hideLoading被调用
  onUnload() {
    hideLoading();
  }
}); 