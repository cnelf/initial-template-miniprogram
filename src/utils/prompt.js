export function showToast(params) {
  const options = {
    title: '',
    icon: 'none',
    mask: true,
    duration: 1500
  };
  if (typeof params === 'string') {
    Object.assign(options, { title: params });
  } else {
    Object.assign(options, params);
  }
  wx.showToast(options);
  return new Promise((resolve) => {
    setTimeout(resolve, options.duration);
  });
}

export const alert = (content, opts = {}) => {
  return wx.showModal({
    title: '提示',
    content,
    confirmText: '我知道了',
    showCancel: false,
    ...opts
  });
};

export function autoLoading(target, options = {}) {
  const action = target instanceof Function ? target() : target;
  if (!(action instanceof Promise)) {
    return action;
  }
  wx.showLoading({ title: options.title || '加载中...', mask: true });
  return action
    .finally(() => {
      wx.hideLoading();
    })
    .catch((err) => {
      if (options.isRetry) {
        retryHandler(err, target, options);
      } else {
        errHandler(err);
      }
    });
}

function retryHandler(err, target, options) {
  const ignoreErrors = /(cancel|ignore|请先登录)/i;
  const msg = err.mess || err.message || err.errMsg;
  if (msg && !ignoreErrors.test(msg)) {
    return wx
      .showModal({
        title: '提示',
        content: msg,
        confirmText: '重试'
      })
      .then(({ confirm }) => {
        if (confirm) {
          return autoLoading(target, options);
        }
      });
  }
  throw err;
}

export function errHandler(err) {
  const ignoreErrors = /(cancel|ignore|请先登录)/i;
  const timeoutErrors = /(request:fail timeout)|(timeout.*\d+ms)/i;
  let msg = err.mess || err.message || err.errMsg;
  msg = timeoutErrors.test(msg) ? '网络好像出了点问题，请稍后再试' : msg;
  if (!ignoreErrors.test(msg)) {
    msg &&
      alert(msg, {
        title: '请求失败'
      });
  }
  throw err;
}
