/**
 * 常量定义文件
 */

// 用户角色
const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ASSISTANT: 'assistant',
  ADMIN: 'admin'
};

// 本地存储键
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  REMEMBER_LOGIN: 'rememberLogin'
};

// 表单验证规则
const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: '邮箱不能为空',
    FORMAT: '邮箱格式不正确'
  },
  PASSWORD: {
    REQUIRED: '密码不能为空',
    MIN_LENGTH: '密码长度至少为6位',
    CONFIRM: '两次输入的密码不一致'
  },
  NAME: {
    REQUIRED: '姓名不能为空'
  },
  STUDENT_ID: {
    REQUIRED: '学号不能为空'
  }
};

// 主题颜色
const THEME = {
  PRIMARY: '#1296db',
  SUCCESS: '#07c160',
  WARNING: '#ff976a',
  ERROR: '#ee0a24',
  INFO: '#909399',
  BACKGROUND: '#f7f8fa',
  TEXT: {
    PRIMARY: '#323233',
    REGULAR: '#646566',
    SECONDARY: '#969799',
    DISABLED: '#c8c9cc'
  }
};

module.exports = {
  USER_ROLES,
  STORAGE_KEYS,
  VALIDATION_RULES,
  THEME
}; 