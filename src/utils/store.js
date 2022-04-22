import Store from 'wxministore';

/**
 * 全局状态state，可用于替代globalData，实现响应式状态
 * 详情查阅：https://github.com/xiaoyao96/wxMiniStore
 */
const store = new Store({
  state: {
    loading: false,
    actId: '',
  },
  openPart: true,
  debug: false
});

export default store;
