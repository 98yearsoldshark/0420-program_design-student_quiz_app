/**
 * 通用工具函数库
 */

// 格式化时间
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

// 检查邮箱格式
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 检查密码强度
const checkPasswordStrength = (password) => {
  if (password.length < 3) {
    return { valid: false, message: '密码长度至少为3位' };
  }
  return { valid: true, message: '密码强度合格' };
};

// 显示消息提示框
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000
  });
};

// 显示加载提示框
const showLoading = (title = '加载中') => {
  wx.showLoading({
    title: title,
    mask: true
  });
};

// 隐藏加载提示框
const hideLoading = () => {
  wx.hideLoading();
};

// 防抖函数
const debounce = (fn, delay = 300) => {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

module.exports = {
  formatTime,
  isValidEmail,
  checkPasswordStrength,
  showToast,
  showLoading,
  hideLoading,
  debounce
}; 