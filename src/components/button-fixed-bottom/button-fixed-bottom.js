import { userAgent } from '@/utils/index';
import _ from '@/lib/lodash';

Component({
  externalClasses: ['footer-class', 'content-class', 'component-class'],

  properties: {
    bgColor: {
      type: String,
      value: '#FFFFFF'
    },
    showFooter: {
      type: Boolean,
      value: true
    },
    footerZIndex: {
      type: Number,
      value: 2
    },
    useContentHeight: {
      type: Boolean,
      value: false
    }
  },

  options: {
    multipleSlots: true
  },

  data: {
    height: 0,
    contentHeight: userAgent.systemInfo.windowHeight,
    showButton: true,
    iphoneXPadding: userAgent.isIphoneX ? 32 : 0
  },

  systemInfo: null,

  calcTimer: 0,

  observers: {
    showFooter: function (newVal) {
      newVal && this.calcHeight();
    }
  },

  lifetimes: {
    ready() {
      const { showFooter } = this.properties;
      showFooter && this.calcHeight();
      this.triggerEvent('iphoneXPadding', this.data.iphoneXPadding);
    }
  },

  methods: {
    calcHeight() {
      clearTimeout(this.calcTimer);
      const calc = () => {
        wx.createSelectorQuery()
          .in(this)
          .select('#footer')
          .boundingClientRect(async (res) => {
            const height = _.get(res, 'height', 0);
            if (!this.systemInfo) {
              this.systemInfo = userAgent.systemInfo;
            }
            this.setData({ height, contentHeight: this.systemInfo.windowHeight - height });
          })
          .exec();
      };
      calc();
      // 确保能拿到rect信息
      this.calcTimer = setTimeout(calc, 1000);
    }
  }
});
