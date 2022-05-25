const STORAGE_KEY = 'key_add_to_my_miniprogram';

Component({
  properties: {
    text: {
      type: String,
      value: '点击添加「我的小程序」，下次访问更便捷'
    },
    duration: {
      type: Number,
      value: 6000
    },
    customNavbar: {
      type: Boolean,
      value: false
    }
  },

  data: {
    show: false,
    menu: {
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    }
  },

  lifetimes: {
    attached() {
      if (!wx.getStorageSync(STORAGE_KEY)) {
        const res = wx.getMenuButtonBoundingClientRect();
        this.setData({
          menu: res,
          show: true
        });
        wx.setStorage({ key: STORAGE_KEY, data: '1' });

        this.timer = setTimeout(() => {
          this.handleClose();
        }, this.data.duration);
      }
    },

    detached() {
      clearTimeout(this.timer);
    }
  },

  methods: {
    handleClose() {
      this.setData({ show: false });
    }
  }
});
