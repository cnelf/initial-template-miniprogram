const {
  miniProgram: { envVersion }
} = wx.getAccountInfoSync();

const config = {
  // 开发版
  develop: {
    baseURL: 'http://yapi.weijuju.com/mock/76',
    staticResPath: 'http://test-resource-platform.socialmind.com.cn/huaer-aum-platform/admin/wx-applet-images'
  },
  // 体验版
  trial: {
    baseURL: 'http://huaer-aum-test-mobile.socialmind.com.cn',
    staticResPath: 'http://test-resource-platform.socialmind.com.cn/huaer-aum-platform/admin/wx-applet-images'
  },
  // 正式版
  release: {
    baseURL: '',
    staticResPath: ''
  }
};

export default config[envVersion];
