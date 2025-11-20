const app = getApp();
const { questionApi, fileApi } = require('../../../service/api');
const { showToast, showLoading, hideLoading } = require('../../../utils/util');
// 暂时注释掉 import 方式，使用 require 代替
// import parse from '@rojer/katex-mini';
const parse = require('@rojer/katex-mini');

Page({
  data: {
    question: {},
    imagesList: [],
    isLoading: false,
    serverUrl: app.globalData.baseUrl || '',
    isCollected: false,
    latexNodes: [] // 存储渲染后的LaTeX节点
  },
  
  onLoad(options) {
    console.log('题目详情页面加载，options:', options); // 调试日志
    
    if (options.questionData) {
      // 从URL参数中获取题目数据
      try {
        const questionData = JSON.parse(decodeURIComponent(options.questionData));
        console.log('从列表页面获取的题目数据:', questionData);
        
        this.setData({ 
          question: questionData,
          isLoading: false
        });
        
        // 如果有LaTeX代码，渲染公式
        if (questionData.latex_code) {
          this.renderLatex(questionData.latex_code);
        } 
        // 如果没有LaTeX代码，尝试加载图片
        else {
          this.loadQuestionImages(questionData);
        }
      } catch (error) {
        console.error('解析题目数据失败:', error);
        this.fallbackToApiRequest(options.id);
      }
    } else if (options.id) {
      this.fallbackToApiRequest(options.id);
    } else {
      showToast('未找到题目数据');
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  // 当无法从传递的数据获取题目信息时，回退到API请求
  fallbackToApiRequest(id) {
    if (!id) {
      showToast('未找到题目ID');
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }
    
    console.log('回退到API请求题目详情, ID:', id);
    this.loadQuestionDetail(id);
  },
  
  // 加载题目详情 (仅作为备选方案)
  loadQuestionDetail(id) {
    this.setData({ isLoading: true });
    showLoading('加载中');
    
    questionApi.getQuestionDetail(id)
      .then(question => {
        hideLoading();
        console.log('通过API获取到题目详情:', question); // 调试信息
        
        this.setData({ 
          question,
          isLoading: false
        });
        
        // 如果有LaTeX代码，使用katex-mini渲染
        if (question.latex_code) {
          this.renderLatex(question.latex_code);
        } 
        // 如果没有LaTeX代码，则尝试加载图片
        else {
          this.loadQuestionImages(question);
        }
      })
      .catch(err => {
        hideLoading();
        this.setData({ isLoading: false });
        showToast('加载题目失败');
        console.error('加载题目失败:', err);
      });
  },
  
  // 渲染LaTeX公式
  renderLatex(latexCode) {
    if (!latexCode) {
      console.error('LaTeX代码为空');
      this.setData({
        latexNodes: [{
          name: 'div',
          attrs: {
            style: 'white-space: pre-wrap; font-family: monospace; padding: 10px; background-color: #f9f9f9; border-radius: 5px;'
          },
          children: [{
            type: 'text',
            text: '没有LaTeX代码'
          }]
        }]
      });
      return;
    }
    
    try {
      // 尝试简化过长或过复杂的LaTeX代码
      let optimizedLatex = latexCode;
      // 如果太长，尝试分段处理
      if (optimizedLatex.length > 1000) {
        console.log('LaTeX代码较长，尝试优化显示');
        // 替换可能导致宽度过大的表格/矩阵为更简单的表示
        optimizedLatex = optimizedLatex.replace(/\\begin\{(array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|cases)\}[\s\S]*?\\end\{\1\}/g, 
                                           (match) => '\\text{[复杂表达式]}');
      }
      
      // 使用katex-mini渲染LaTeX代码
      const nodes = parse(optimizedLatex, {
        throwError: false, // 解析失败不抛出错误，直接显示错误信息
        displayMode: true, // 显示模式，使公式居中显示
        output: 'html', // 输出HTML格式，更好支持换行
        strict: false, // 不严格模式，更宽松地处理格式
        maxSize: 10 // 限制渲染复杂度
      });
      
      console.log('LaTeX渲染结果:', nodes); // 调试信息
      
      // 确保nodes是有效的富文本节点数组
      if (nodes && Array.isArray(nodes)) {
        this.setData({
          latexNodes: nodes
        });
      } else {
        throw new Error('渲染结果不是有效的节点数组');
      }
    } catch (error) {
      console.error('LaTeX渲染失败:', error);
      // 渲染失败时显示原始LaTeX代码
      this.setData({
        latexNodes: [{
          name: 'div',
          attrs: {
            style: 'white-space: pre-wrap; font-family: monospace; padding: 10px; background-color: #f9f9f9; border-radius: 5px;'
          },
          children: [{
            type: 'text',
            text: latexCode
          }]
        }]
      });
    }
  },
  
  // 加载题目图片
  loadQuestionImages(question) {
    const folderPath = question.latex_path.split('/').slice(1).join('/');
    
    fileApi.getImages(folderPath)
      .then(images => {
        console.log('获取到题目图片:', images); // 调试信息
        this.setData({ imagesList: images });
      })
      .catch(err => {
        console.error('加载题目图片失败:', err);
      });
  },
  
  // 图片预览
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    const urls = this.data.imagesList.map(item => this.data.serverUrl + item.url);
    
    wx.previewImage({
      current: url,
      urls: urls
    });
  },
  
  // 收藏题目
  handleCollect() {
    const isCollected = !this.data.isCollected;
    
    // TODO: 调用收藏API或本地存储收藏
    
    this.setData({ isCollected });
    showToast(isCollected ? '收藏成功' : '取消收藏', 'success');
  },
  
  // 分享
  onShareAppMessage() {
    const question = this.data.question;
    return {
      title: `${question.subject}题目分享`,
      path: `/pages/questions/detail/detail?id=${question.id}`,
      imageUrl: this.data.imagesList.length > 0 ? this.data.serverUrl + this.data.imagesList[0].url : ''
    };
  },
  
  // 当页面卸载时，确保hideLoading被调用
  onUnload() {
    hideLoading();
  }
}); 