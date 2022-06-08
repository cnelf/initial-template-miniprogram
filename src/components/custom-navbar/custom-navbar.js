import { userAgent } from '@/utils/index';

Component({
  properties: {
    showStatusBar: {
      type: Boolean,
      value: true
    },
    statusBarBackground: {
      type: String,
      value: '#f4f4f4'
    },
    showNavbar: {
      type: Boolean,
      value: true
    },
    navbarBackground: {
      type: String,
      value: '#f4f4f4'
    },
    title: {
      type: String,
      value: ''
    }
  },

  data: {
    menuButtonInfo: {},
    statusBarHeight: 0,
    isTabPage: true
  },

  observers: {
    title: function (newVal) {
      newVal && wx.setNavigationBarTitle({ title: newVal });
    }
  },

  lifetimes: {
    attached() {
      this.setData({
        isTabPage: wx.$router.isTabPage()
      });
    }
  },

  pageLifetimes: {
    show() {
      userAgent.setMenuButtonInfo();
      this.setData({
        menuButtonInfo: userAgent.menuButtonInfo,
        statusBarHeight: userAgent.systemInfo.statusBarHeight
      });
    }
  },

  methods: {
    goBack() {
      wx.$router.navigateBack();
    },

    noop() {} // 阻止滚动穿透
  }
});
