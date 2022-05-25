import '@lib/polyfill';
import { promisifyAll } from '@lib/wx-promise-pro';
import { store, history, relaunchCurrentPage } from '@utils/index';
import env from '@api/env';

App({
  globalData: {}, // 请使用'/utils/store.js'替代globalData
  async onLaunch() {
    promisifyAll();
    wx.$env = env;
    wx.$router = history;
    return relaunchCurrentPage();
  },
  store
});
