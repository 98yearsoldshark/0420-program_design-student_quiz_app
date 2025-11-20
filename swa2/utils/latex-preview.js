/**
 * 简单的LaTeX预览工具，不依赖外部库
 * 用于在列表页显示题目预览时使用
 */

/**
 * 提取LaTeX公式中的纯文本内容
 * @param {string} latexCode - 原始LaTeX代码
 * @returns {array} 返回富文本节点数组，用于rich-text组件
 */
function extractLatexPreview(latexCode) {
  if (!latexCode) return [{
    name: 'div',
    children: [{ type: 'text', text: '无LaTeX内容' }]
  }];
  
  try {
    // 查找文本内容，通常在\text{}中
    const textRegex = /\\text\{([^}]+)\}/g;
    let textMatches = [];
    let match;
    
    while ((match = textRegex.exec(latexCode)) !== null) {
      textMatches.push(match[1]);
    }
    
    // 如果没有找到\text内容，则提取问题编号（如果存在）
    if (textMatches.length === 0) {
      const numRegex = /(\d+\.\s*[^\\]+)/;
      const numMatch = numRegex.exec(latexCode);
      if (numMatch) {
        textMatches.push(numMatch[1]);
      } else {
        // 如果还是没找到，返回前100个字符
        textMatches.push(latexCode.substring(0, 100) + '...');
      }
    }
    
    // 构建富文本节点
    return [{
      name: 'div',
      attrs: {
        style: 'font-family: sans-serif; padding: 5px; background-color: #f9f9f9;'
      },
      children: textMatches.map(text => ({
        name: 'div',
        children: [{ type: 'text', text: text }]
      }))
    }];
  } catch (error) {
    console.error('提取LaTeX预览失败:', error);
    return [{
      name: 'div',
      attrs: { style: 'color: #666;' },
      children: [{ type: 'text', text: '预览加载中...' }]
    }];
  }
}

/**
 * 简单渲染LaTeX文本（仅作预览用）
 * @param {string} latexCode - 原始LaTeX代码
 * @returns {array} 返回富文本节点数组，用于rich-text组件
 */
function simpleLaTexRender(latexCode) {
  return extractLatexPreview(latexCode);
}

module.exports = {
  extractLatexPreview,
  simpleLaTexRender
}; 