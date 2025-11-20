const app = getApp();
const { questionApi, fileApi } = require('../../../service/api');
const { showToast, showLoading, hideLoading } = require('../../../utils/util');
import parse from '@rojer/katex-mini';

Page({
  data: {
    questions: [],
    pageSize: 10,
    pageNum: 1,
    hasMoreData: true,
    isLoading: false,
    
    // 筛选条件相关
    subjects: [],
    grades: [],
    years: [],
    types: [],
    subjectIndex: -1,
    gradeIndex: -1,
    yearIndex: -1,
    typeIndex: -1,
    
    // 当前筛选参数
    currentFilter: {
      subject: '',
      grade: '',
      year: '',
      type: ''
    },
    
    // LaTeX预览相关
    previewLatexMap: {} // 存储每个题目的LaTeX预览节点
  },
  
  onLoad() {
    console.log('题目列表页面加载'); // 调试日志
    this.loadFilterOptions();
    this.loadQuestions();
  },
  
  // 加载筛选选项
  loadFilterOptions() {
    fileApi.getFolders()
      .then(res => {
        console.log('获取到科目列表:', res); // 调试日志
        const subjects = res.filter(item => item.type === 'folder').map(item => item.name);
        this.setData({ subjects });
      })
      .catch(err => {
        console.error('获取科目失败:', err);
      });
      
    // 年级、年份、类型可以硬编码或从后端获取
    this.setData({
      grades: ['大一', '大二', '大三', '大四', '研究生'],
      years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      types: ['A卷', 'B卷', 'C卷', '期中', '期末']
    });
  },
  
  // 加载题目列表数据
  loadQuestions(refresh = false) {
    if (this.data.isLoading) return;
    
    const pageNum = refresh ? 1 : this.data.pageNum;
    const params = {
      pageSize: this.data.pageSize,
      pageNum: pageNum,
      ...this.data.currentFilter
    };
    
    console.log('请求题目列表参数:', params); // 调试日志
    
    this.setData({ isLoading: true });
    showLoading('加载中');
    
    questionApi.getQuestionList(params)
      .then(res => {
        hideLoading();
        const questionList = res || []; // 防止返回值为null或undefined
        console.log('获取到题目列表:', questionList); // 调试日志
        
        // 判断是否还有更多数据
        const hasMoreData = questionList && questionList.length === this.data.pageSize;
        
        if (refresh) {
          this.setData({
            questions: questionList,
            pageNum: 1,
            hasMoreData,
            isLoading: false
          }, () => {
            // 在setData回调中处理LaTeX预览，确保数据已更新
            if (questionList && questionList.length > 0) {
              this.processLatexPreviews(questionList);
            }
          });
        } else {
          this.setData({
            questions: [...this.data.questions, ...questionList],
            pageNum: pageNum + 1,
            hasMoreData,
            isLoading: false
          }, () => {
            // 在setData回调中处理LaTeX预览，确保数据已更新
            if (questionList && questionList.length > 0) {
              this.processLatexPreviews([...this.data.questions]);
            }
          });
        }
      })
      .catch(err => {
        hideLoading();
        this.setData({ 
          isLoading: false,
          questions: this.data.questions || [] // 确保questions始终是数组
        });
        showToast('加载题目失败');
        console.error('加载题目失败:', err);
      });
  },
  
  // 处理LaTeX预览
  processLatexPreviews(questions) {
    if (!questions || questions.length === 0) return;
    
    try {
      const previewLatexMap = {};
      
      questions.forEach(question => {
        if (question && question.id && question.latex_code) {
          try {
            // 提取题目文本而不是截取前50个字符
            let previewLatex = this.extractQuestionPreview(question.latex_code);
            
            // 简化内容，避免过于复杂的结构
            if (previewLatex.length > 200) {
              previewLatex = previewLatex.substring(0, 200) + '}\n\\end{align*}';
              console.log('简化后的预览LaTeX:', previewLatex);
            }
            
            // 使用katex-mini解析预览内容
            const nodes = parse(previewLatex, {
              throwError: false,
              displayMode: true,
              output: 'html', // 输出HTML格式，更好支持换行
              strict: false, // 不严格模式，更宽松地处理格式
              maxSize: 5 // 限制渲染复杂度
            });
            
            previewLatexMap[question.id] = nodes;
            console.log(`成功解析题目${question.id}的LaTeX预览`);
          } catch (error) {
            console.error(`解析题目${question.id}的LaTeX预览失败:`, error);
            // 解析失败时使用普通文本显示
            previewLatexMap[question.id] = null;
          }
        }
      });
      
      this.setData({ previewLatexMap });
      console.log('预览LaTeX映射:', this.data.previewLatexMap);
    } catch (err) {
      console.error('处理LaTeX预览时出错:', err);
    }
  },
  
  // 提取题目预览文本
  extractQuestionPreview(latexCode) {
    if (!latexCode) return '';
    
    try {
      // 查找 \begin{align*} 或类似的开始标记
      const beginIndex = latexCode.indexOf('\\begin');
      if (beginIndex === -1) return latexCode.substring(0, 100); // 如果没有找到，返回前100个字符
      
      // 从 \begin 开始查找第一个 &\text 标记
      const textStartIndex = latexCode.indexOf('&\\text', beginIndex);
      if (textStartIndex === -1) {
        // 如果没有找到 &\text，则查找其他可能的标题文本标识
        const possibleTextStartIndex = latexCode.indexOf('\\text', beginIndex);
        if (possibleTextStartIndex === -1) {
          return `\\begin{align*}\n${latexCode.substring(beginIndex + 6, beginIndex + 100)}\n\\end{align*}`;
        } else {
          // 找到了 \text
          let endIndex = latexCode.indexOf('\\\\', possibleTextStartIndex);
          if (endIndex === -1) endIndex = possibleTextStartIndex + 100;
          return `\\begin{align*}\n${latexCode.substring(possibleTextStartIndex, endIndex)}\n\\end{align*}`;
        }
      }
      
      // 获取题目文本，一直到第一个换行或者最多取100个字符
      let endIndex = latexCode.indexOf('\\\\', textStartIndex);
      if (endIndex === -1 || endIndex > textStartIndex + 100) {
        endIndex = textStartIndex + 100;
      }
      
      // 提取题目文本部分
      const questionText = latexCode.substring(textStartIndex, endIndex).trim();
      console.log('提取的题目文本:', questionText);
      
      // 构建预览LaTeX代码
      return `\\begin{align*}\n${questionText}\n\\end{align*}`;
    } catch (error) {
      console.error('提取LaTeX预览失败:', error);
      // 出错时返回有限长度的原始文本
      return latexCode.substring(0, 100) + '...';
    }
  },
  
  // 加载更多题目
  loadMoreQuestions() {
    if (!this.data.hasMoreData || this.data.isLoading) return;
    this.loadQuestions();
  },
  
  // 处理科目筛选变化
  handleSubjectChange(e) {
    const subjectIndex = Number(e.detail.value);
    const subject = this.data.subjects[subjectIndex] || '';
    
    console.log('选择科目:', subject); // 调试日志
    
    this.setData({
      subjectIndex,
      'currentFilter.subject': subject
    });
    
    this.loadQuestions(true);
  },
  
  // 处理年级筛选变化
  handleGradeChange(e) {
    const gradeIndex = Number(e.detail.value);
    const grade = this.data.grades[gradeIndex] || '';
    
    console.log('选择年级:', grade); // 调试日志
    
    this.setData({
      gradeIndex,
      'currentFilter.grade': grade
    });
    
    this.loadQuestions(true);
  },
  
  // 处理年份筛选变化
  handleYearChange(e) {
    const yearIndex = Number(e.detail.value);
    const year = this.data.years[yearIndex] || '';
    
    console.log('选择年份:', year); // 调试日志
    
    this.setData({
      yearIndex,
      'currentFilter.year': year
    });
    
    this.loadQuestions(true);
  },
  
  // 处理试卷类型筛选变化
  handleTypeChange(e) {
    const typeIndex = Number(e.detail.value);
    const type = this.data.types[typeIndex] || '';
    
    console.log('选择类型:', type); // 调试日志
    
    this.setData({
      typeIndex,
      'currentFilter.type': type
    });
    
    this.loadQuestions(true);
  },
  
  // 跳转到题目详情
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    // 找到对应的题目完整数据
    const question = this.data.questions.find(item => item.id === id);
    console.log('跳转到题目详情，题目数据:', question); // 调试日志
    
    // 将完整题目数据序列化并传递给详情页
    wx.navigateTo({
      url: `/pages/questions/detail/detail?id=${id}&questionData=${encodeURIComponent(JSON.stringify(question))}`
    });
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    this.loadQuestions(true);
    wx.stopPullDownRefresh();
  },
  
  // 上拉加载更多
  onReachBottom() {
    this.loadMoreQuestions();
  },
  
  // 当页面卸载时，确保hideLoading被调用
  onUnload() {
    hideLoading();
  }
}); 