/**
 * Babel 依赖 polyfill
 * 用于解决 "@babel/runtime/helpers/defineProperty.js" 依赖问题
 */

// defineProperty polyfill
function defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// 导出常用的 Babel helper 函数
module.exports = {
  defineProperty
}; 