function _readOnlyError(name) {
  throw new Error('"' + name + '" is read-only');
}

const parseTime = function parseTime(time) {
  const format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '{y}-{m}-{d} 星期{a} {h}:{i}:{s}';
  if (
    Object.prototype.toString
      .call(time)
      .replace(/(^\[object )|(\]$)/g, '')
      .toLowerCase() !== 'date'
  ) {
    time = new Date(Number(time));
  }
  const formatObj = {
    y: time.getFullYear(),
    m: time.getMonth() + 1,
    d: time.getDate(),
    h: time.getHours(),
    i: time.getMinutes(),
    s: time.getSeconds(),
    a: time.getDay()
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return timeStr;
};

Page({
  submit: function submit(_ref) {
    const _this = this;
    const topic = _ref.detail.value.topic;
    if (!topic)
      return wx.showToast({
        title: '请输入主题',
        icon: 'none'
      });
    if (topic.length > 32)
      return wx.showToast({
        title: '不得超出32位字符',
        icon: 'none'
      });

    if (this.busy) return;
    this.busy = true;

    const info = topic;
    wx.getStorage({
      key: 'check-list',
      success: function success(res) {
        let arr = JSON.parse(res.data);
        if (arr.length === 50) arr = (_readOnlyError('arr'), []);
        arr.push({
          info: info,
          date: parseTime(new Date(), '{y}/{m}/{d}-{h}:{i}:{s}')
        });
        wx.setStorage({
          key: 'check-list',
          data: JSON.stringify(arr)
        });
      },
      fail: function fail() {
        wx.setStorage({
          key: 'check-list',
          data: JSON.stringify([
            {
              info: info,
              date: parseTime(new Date(), '{y}/{m}/{d}-{h}:{i}:{s}')
            }
          ])
        });
      },
      complete: function complete() {
        _this.busy = false;
        wx.showToast({
          title: '签到成功',
          icon: 'none'
        });
        wx.navigateTo({
          url: '/components/mock-page/record/record'
        });
      }
    });
  }
});
