const app = getApp();
const { userApi } = require('../../service/api');
const { showToast, showLoading, hideLoading, checkPasswordStrength } = require('../../utils/util');
const { VALIDATION_RULES, STORAGE_KEYS } = require('../../constants/index');

Page({
  data: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    currentPasswordError: '',
    newPasswordError: '',
    confirmPasswordError: ''
  },
  
  // 处理当前密码输入
  handleCurrentPasswordInput(e) {
    this.setData({
      currentPassword: e.detail.value,
      currentPasswordError: ''
    });
  },
  
  // 处理新密码输入
  handleNewPasswordInput(e) {
    this.setData({
      newPassword: e.detail.value,
      newPasswordError: ''
    });
    
    // 如果确认密码已输入，则验证两次密码是否一致
    if (this.data.confirmPassword) {
      if (e.detail.value !== this.data.confirmPassword) {
        this.setData({
          confirmPasswordError: VALIDATION_RULES.PASSWORD.CONFIRM
        });
      } else {
        this.setData({
          confirmPasswordError: ''
        });
      }
    }
  },
  
  // 处理确认密码输入
  handleConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
    
    if (e.detail.value !== this.data.newPassword) {
      this.setData({
        confirmPasswordError: VALIDATION_RULES.PASSWORD.CONFIRM
      });
    } else {
      this.setData({
        confirmPasswordError: ''
      });
    }
  },
  
  // 验证表单
  validateForm() {
    let isValid = true;
    
    // 验证当前密码
    if (!this.data.currentPassword.trim()) {
      this.setData({
        currentPasswordError: '当前密码不能为空'
      });
      isValid = false;
    }
    
    // 验证新密码
    if (!this.data.newPassword.trim()) {
      this.setData({
        newPasswordError: VALIDATION_RULES.PASSWORD.REQUIRED
      });
      isValid = false;
    } else {
      const passwordCheck = checkPasswordStrength(this.data.newPassword);
      if (!passwordCheck.valid) {
        this.setData({
          newPasswordError: passwordCheck.message
        });
        isValid = false;
      }
    }
    
    // 验证确认密码
    if (this.data.newPassword !== this.data.confirmPassword) {
      this.setData({
        confirmPasswordError: VALIDATION_RULES.PASSWORD.CONFIRM
      });
      isValid = false;
    }
    
    return isValid;
  },
  
  // 处理密码修改
  handleChangePassword() {
    if (!this.validateForm()) return;
    
    this.setData({ isLoading: true });
    showLoading('修改中');
    
    const { currentPassword, newPassword } = this.data;
    
    userApi.changePassword({
      currentPassword,
      newPassword
    })
      .then(res => {
        hideLoading();
        this.setData({ isLoading: false });
        
        showToast('密码修改成功，请重新登录', 'success');
        
        // 清除登录状态，要求用户重新登录
        wx.removeStorageSync(STORAGE_KEYS.TOKEN);
        wx.removeStorageSync(STORAGE_KEYS.USER_INFO);
        app.globalData.token = null;
        app.globalData.userInfo = null;
        app.globalData.isLoggedIn = false;
        
        // 返回登录页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }, 1500);
      })
      .catch(err => {
        hideLoading();
        this.setData({ isLoading: false });
        
        if (err.statusCode === 401) {
          showToast('当前密码错误');
        } else {
          showToast('修改密码失败，请稍后重试');
        }
        console.error('修改密码失败:', err);
      });
  },
  
  // 当页面卸载时，确保hideLoading被调用
  onUnload() {
    hideLoading();
  }
}); 