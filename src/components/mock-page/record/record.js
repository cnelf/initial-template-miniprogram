Component({
  data: {
    list: []
  },
  pageLifetimes: {
    show: function show() {
      let _this = this;
      wx.getStorage({
        key: 'check-list',
        success: function success(res) {
          try {
            let list = JSON.parse(res.data);
            list = list.reduce(function (acc, item) {
              if (item.info !== '') {
                acc.push({
                  info: item.info = item.info.replace(/#iswebview#/g, ''),
                  date: item.date
                });
              }
              return acc;
            }, []);
            _this.setData({
              list: list
            });
          } catch (_unused) {
            _this.setData({
              list: []
            });
          }
        },
        fail: function fail() {
          return _this.setData({
            list: []
          });
        }
      });
    }
  },
  // 我的签到
  methods: {
    mySign: function mySign() {
      wx.pageScrollTo({
        scrollTop: 400,
        duration: 300
      });
    },
    more: function more() {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  }
});
