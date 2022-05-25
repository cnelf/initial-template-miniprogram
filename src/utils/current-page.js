import { CURRENT_PAGE_PATH_KEY } from '@constants/index';
import { uiStore } from '@store/index';
import { store, sleep } from '@utils/index';

export function setCurrentPagePath(path) {
  wx.removeStorageSync(CURRENT_PAGE_PATH_KEY);
  wx.setStorageSync(CURRENT_PAGE_PATH_KEY, path);
}

/**
 * 缓存用户当前浏览的页面，使用户从其他场景进入小程序时重定向回该页面
 */
export async function relaunchCurrentPage() {
  const { scene, path } = wx.getLaunchOptionsSync();
  const { platform } = uiStore.systemInfo;
  const isScene = [1007, 1008, 1017, 1047, 1048, 1049].includes(scene); // 1007：单人聊天会话中的小程序消息卡片；1008：群聊会话中的小程序消息卡片；1017：前往体验版的入口页；1047：扫描小程序码；1048：长按图片识别小程序码；1049：手机相册识别小程序码
  const currentPagePath = wx.getStorageSync(CURRENT_PAGE_PATH_KEY);
  const regExp = new RegExp(path);

  /**
   * 使用全局状态loading
   * 作用：防止页面在跳转前渲染首页的内容
   */
  if (platform !== 'devtools' && !isScene && !regExp.test(currentPagePath)) {
    store.setState({ loading: true });
    currentPagePath && wx.reLaunch({ url: currentPagePath });
    await sleep(1000);
    store.setState({ loading: false });
  }
}
