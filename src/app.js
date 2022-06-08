import '@/lib/polyfill';
import env from '@/api/env';
import * as api from '@/api/index';
import { store } from '@/store/index';
import { promisifyAll } from '@/lib/wx-promise-pro';
import { router, showToast, alert, confirm, loading } from '@/utils/index';

App({
  store,
  globalData: {}, // 请使用'/store/index'替代globalData

  onLaunch() {
    promisifyAll();
    wx.$env = env;
    wx.$http = api;
    wx.$store = store;
    wx.$router = router;
    wx.$showToast = showToast;
    wx.$alert = alert;
    wx.$confirm = confirm;
    wx.$loading = loading;
  },

  onShow() {
    this.checkUpdateManager();
  },

  // 检查是否有新版本
  checkUpdateManager() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(async () => {
      const res = await wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？'
      });
      res.confirm && updateManager.applyUpdate();
    });
  }
});
