module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    eqeqeq: 2,
    quotes: [
      1,
      'single'
    ],
    'no-console': 1,
    'no-debugger': 1,
    'semi': 2,
    'no-var': 2,
    'no-trailing-spaces': 2,
    'eol-last': 2,
    'no-alert': 2,
    'no-lone-blocks': 2,
    'key-spacing': 2,
    'comma-spacing': 2,
    'space-infix-ops': 2,
    'block-spacing': 2,
    'computed-property-spacing': 2,
    'func-call-spacing': 2,
    'keyword-spacing': 2,
    'switch-colon-spacing': 2,
    'arrow-spacing': 2,
    'rest-spread-spacing': 2,
    'generator-star-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    'object-curly-spacing': [
      2,
      'always'
    ],
    'import/named': 0,
    'import/no-unresolved': 0
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
