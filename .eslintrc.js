module.exports = {
  extends: ['huaer', 'prettier'],
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn'
  },
  globals: {
    // 小程序的全局变量
    __DEV__: true,
    __WECHAT__: true,
    __wxConfig: true,
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getApp: true,
    getDate: true,
    getRegExp: true,
    getCurrentPages: true
  }
};
