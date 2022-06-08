import Store from 'wxministore';

/**
 * 全局状态state，可用于替代globalData，实现响应式状态
 * 详情查阅：https://github.com/xiaoyao96/wxMiniStore
 */
export const store = new Store({
  state: {
    version: 0 // 小程序版本号
  },
  openPart: true,
  debug: false
});
