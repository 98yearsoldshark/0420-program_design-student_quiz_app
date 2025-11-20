/**
 * API请求服务
 */
const app = getApp();

// 用户相关API
const userApi = {
  // 用户登录
  login: (data) => {
    return app.request({
      url: '/login',
      method: 'POST',
      data: data,
      needToken: false
    });
  },
  
  // 用户注册
  register: (data) => {
    return app.request({
      url: '/register',
      method: 'POST',
      data: data,
      needToken: false
    });
  },
  
  // 修改密码
  changePassword: (data) => {
    return app.request({
      url: '/change-password',
      method: 'PUT',
      data: data
    });
  },
  
  // 获取用户信息
  getUserInfo: (userId) => {
    return app.request({
      url: `/users/${userId}`,
      method: 'GET'
    });
  },
  
  // 更新用户信息
  updateUserInfo: (userId, data) => {
    return app.request({
      url: `/users/${userId}`,
      method: 'PUT',
      data: data
    });
  }
};

// 题目相关API
const questionApi = {
  // 获取题目列表
  getQuestionList: (params) => {
    return app.request({
      url: '/latex-questions',
      method: 'GET',
      data: params
    });
  },
  
  // 获取特定题目
  getQuestionDetail: (id) => {
    return app.request({
      url: `/latex-questions/${id}`,
      method: 'GET'
    });
  },
  
  // 提交答案
  submitAnswer: (data) => {
    return app.request({
      url: '/submit-answer',
      method: 'POST',
      data: data
    });
  }
};

// 文件相关API
const fileApi = {
  // 获取文件夹列表
  getFolders: (params) => {
    return app.request({
      url: '/folders',
      method: 'GET',
      data: params
    });
  },
  
  // 获取图片列表
  getImages: (folderPath) => {
    return app.request({
      url: '/images',
      method: 'GET',
      data: { folderPath }
    });
  },
  
  // 上传文件
  uploadFile: (filePath) => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.baseUrl + '/upload',
        filePath: filePath,
        name: 'file',
        header: {
          'Authorization': 'Bearer ' + app.globalData.token
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(res.data));
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  
  // OCR识别
  ocrRecognize: (imageUrl) => {
    return app.request({
      url: '/api/tx-ocr',
      method: 'POST',
      data: { imageUrl }
    });
  }
};

module.exports = {
  userApi,
  questionApi,
  fileApi
}; 