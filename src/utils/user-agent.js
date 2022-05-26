class UserAgent {
  constructor() {
    this.setSystemInfo();
    this.setMenuButtonInfo();
  }

  setSystemInfo() {
    try {
      this.systemInfo = wx.getSystemInfoSync();
    } catch {
      this.systemInfo = wx.getSystemInfoSync();
    } finally {
      this.systemInfo.platform || (this.systemInfo = wx.getSystemInfoSync());
    }
  }

  setMenuButtonInfo() {
    this._menuButtonInfo = wx.getMenuButtonBoundingClientRect();
  }

  getGap() {
    // 获取胶囊顶部到状态栏的间隙
    const { top } = this._menuButtonInfo;
    if (top) {
      const { statusBarHeight } = this.systemInfo;
      return top - statusBarHeight;
    } else {
      return this.isIOS ? 4 : 8;
    }
  }

  get menuButtonInfo() {
    const gap = this.getGap();
    const { height = 32, right } = this._menuButtonInfo;
    const totalHeight = gap * 2 + height; // 导航条的高度(不包括状态栏高度)
    const rightGap = right ? this.systemInfo.screenWidth - right : 7;

    return {
      ...this._menuButtonInfo,
      gap,
      totalHeight,
      rightGap
    };
  }

  /**
   * iPhone X: iPhone10,3 / iPhone10,6
   * iPhone XR: iPhone11,8
   * iPhone XS: iPhone11,2
   * iPhone 11: iPhone12,1
   * iPhone 11 Pro: iPhone12,3
   * iPhone XS Max: iPhone11,6 / iPhone11,4
   * iPhone 11 Pro Max: iPhone12,5
   */
  get isIphoneX() {
    const { model } = this.systemInfo;
    return /iPhone X|iPhone10,3|iPhone10,6|iPhone11,8|iPhone11,1|iPhone11,2|iPhone11,3|iPhone11,6|iPhone11,4|iPhone12,1|iPhone12,5/gi.test(
      model
    );
  }

  get safeBottom() {
    return this.isIphoneX ? 32 : 0;
  }

  get isIOS() {
    const { platform } = this.systemInfo;
    if (platform) {
      return platform.toUpperCase() === 'IOS';
    } else {
      return false;
    }
  }
}

export const userAgent = new UserAgent();
