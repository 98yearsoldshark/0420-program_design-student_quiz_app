// pages/index/index.js
const app = getApp();
const { STORAGE_KEYS } = require('../../constants/index');
import parse from "@rojer/katex-mini";
Page({
  data: {
    isLoggedIn: false,
    nodes: [],
    latex: ``,
    userInfo: null
  },
  
  onInput: function (e) {
    this.setData({
      latex: e.detail.value,
    });
  },

  renderLatex: function () {
    try {
      // 尝试简化过长的LaTeX代码
      let optimizedLatex = this.data.latex;
      if (optimizedLatex.length > 1000) {
        console.log('LaTeX代码较长，尝试优化显示');
        // 替换可能导致宽度过大的表格/矩阵
        optimizedLatex = optimizedLatex.replace(/\\begin\{(array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|cases)\}[\s\S]*?\\end\{\1\}/g, 
                                           (match) => '\\text{[复杂表达式]}');
      }
      
      const nodes = parse(optimizedLatex, {
        throwError: true,
        displayMode: true,
        output: 'html',
        strict: false,
        maxSize: 10 // 限制渲染复杂度
      });
      this.setData({
        nodes,
      });
    } catch (error) {
      console.log(error);
      this.setData({
        nodes: [
          {
            name: "div",
            attrs: {
              style: "color: red;",
            },
            children: [
              {
                type: "text",
                text: "渲染错误",
              },
            ],
          },
        ],
      });
    }
  },
  onLoad() {
    this.checkLoginStatus();
  },
  
  onShow() {
    this.checkLoginStatus();
    this.renderLatex();

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
  
  // 跳转到题目列表页面
  goToQuestionsList() {
    wx.navigateTo({
      url: '/pages/questions/list/list'
    });
  }
})
