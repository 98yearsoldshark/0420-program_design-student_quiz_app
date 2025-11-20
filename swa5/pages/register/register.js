// pages/register/register.js
const { userApi } = require('../../service/api');
const { isValidEmail, showToast, showLoading, hideLoading, checkPasswordStrength } = require('../../utils/util');
const { VALIDATION_RULES } = require('../../constants/index');

Page({
  data: {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    school: '',
    classNumber: '',
    studentId: '',
    wechat: '',
    isLoading: false,
    
    // 错误信息
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    nameError: '',
    studentIdError: ''
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
    
    if (e.detail.value !== this.data.password) {
      this.setData({
        confirmPasswordError: VALIDATION_RULES.PASSWORD.CONFIRM
      });
    } else {
      this.setData({
        confirmPasswordError: ''
      });
    }
  },
  
  // 处理姓名输入
  handleNameInput(e) {
    this.setData({
      name: e.detail.value,
      nameError: ''
    });
  },
  
  // 处理电话输入
  handlePhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  
  // 处理学校输入
  handleSchoolInput(e) {
    this.setData({
      school: e.detail.value
    });
  },
  
  // 处理班级输入
  handleClassInput(e) {
    this.setData({
      classNumber: e.detail.value
    });
  },
  
  // 处理学号输入
  handleStudentIdInput(e) {
    this.setData({
      studentId: e.detail.value,
      studentIdError: ''
    });
  },
  
  // 处理微信输入
  handleWechatInput(e) {
    this.setData({
      wechat: e.detail.value
    });
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
    } else {
      const passwordCheck = checkPasswordStrength(this.data.password);
      if (!passwordCheck.valid) {
        this.setData({
          passwordError: passwordCheck.message
        });
        isValid = false;
      }
    }
    
    // 验证确认密码
    if (this.data.password !== this.data.confirmPassword) {
      this.setData({
        confirmPasswordError: VALIDATION_RULES.PASSWORD.CONFIRM
      });
      isValid = false;
    }
    
    // 验证姓名
    if (!this.data.name.trim()) {
      this.setData({
        nameError: VALIDATION_RULES.NAME.REQUIRED
      });
      isValid = false;
    }
    
    // 验证学号
    if (!this.data.studentId.trim()) {
      this.setData({
        studentIdError: VALIDATION_RULES.STUDENT_ID.REQUIRED
      });
      isValid = false;
    }
    
    return isValid;
  },
  
  // 处理注册
  handleRegister() {
    if (!this.validateForm()) return;
    
    this.setData({ isLoading: true });
    showLoading('注册中');
    
    const { email, password, name, phone, school, classNumber, studentId, wechat } = this.data;
    
    userApi.register({
      email,
      password,
      name,
      phone,
      school,
      classNumber,
      studentId,
      wechat,
      isFromTeacher: false
    })
      .then(res => {
        hideLoading();
        this.setData({ isLoading: false });
        
        showToast('注册成功，请登录', 'success');
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      })
      .catch(err => {
        hideLoading();
        this.setData({ isLoading: false });
        
        if (err.statusCode === 400) {
          showToast('注册失败：' + (err.data?.message || '参数错误'));
        } else {
          showToast('注册失败，请稍后重试');
        }
        console.error('注册失败:', err);
      });
  },
  
  // 返回登录页面
  goBack() {
    wx.navigateBack();
  },
  
  // 当页面卸载时，确保hideLoading被调用
  onUnload() {
    hideLoading();
  }
}); 