import '@/lib/polyfill';
import { promisifyAll } from '@/lib/wx-promise-pro';
import { history } from '@/utils/index';
import { store } from '@/store/index';
import env from '@/api/env';

App({
  globalData: {}, // 请使用'/utils/store'替代globalData
  async onLaunch() {
    promisifyAll();
    wx.$env = env;
    wx.$router = history;
  },
  store
});
