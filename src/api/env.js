const {
  miniProgram: { envVersion }
} = wx.getAccountInfoSync();

const config = {
  develop: {
    // 开发版
    baseURL: 'http://yapi.weijuju.com/mock/76',
    staticResPath: 'http://test-resource-platform.socialmind.com.cn/huaer-aum-platform/admin/wx-applet-images',
    adminUid: 1
  },
  trial: {
    // 体验版
    baseURL: 'http://huaer-aum-test-mobile.socialmind.com.cn',
    staticResPath: 'http://test-resource-platform.socialmind.com.cn/huaer-aum-platform/admin/wx-applet-images',
    adminUid: 1
  },
  release: {
    // 正式版
    baseURL: '',
    staticResPath: '',
    adminUid: 1
  }
};

export default config[envVersion];
