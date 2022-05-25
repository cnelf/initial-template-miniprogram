import qs from 'qs';

class History {
  constructor() {
    this.tabPages = []; // tabBar页
    this.tabQueryList = {}; // tanBar页参数
  }

  get currentPage() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
  }

  get prevPage() {
    const pages = getCurrentPages();
    return pages[pages.length - 2];
  }

  isTabPage(url = this.currentPage.route) {
    const onlyPath = url.split('?')[0];
    const reg = new RegExp(onlyPath);

    return !!this.tabPages.find((item) => reg.test(item));
  }

  goHome() {
    return wx.reLaunch({ url: '/pages/index/index' });
  }

  navigateTo(options) {
    // 处理超过十级页面无法跳转问题
    const pages = getCurrentPages();
    const navType = pages.length < 10 ? 'navigateTo' : 'redirectTo';
    return wx[navType](options);
  }

  redirectTo(options) {
    return wx.redirectTo(options);
  }

  reLaunch(options) {
    return wx.reLaunch(options);
  }

  switchTab(options) {
    const { url } = options;
    const [link, search] = url.split('?');
    // 支持跳转 tab 时，传递参数，一般是 url 来源 api
    this.tabQueryList[link] = qs.parse(search);
    wx.switchTab({ ...options, url: link });
  }

  navigateBack(options = {}) {
    const { delta = 1 } = options;
    const pages = getCurrentPages();
    const canBack = pages.length > delta;
    canBack ? wx.navigateBack(options) : this.goHome();
  }

  nav(link) {
    if (link) {
      if (this.isTabPage(link)) {
        this.switchTab({ url: link });
      } else {
        this.navigateTo({ url: link });
      }
    }
  }
}

export const history = new History();
