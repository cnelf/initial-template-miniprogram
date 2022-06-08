const {
  miniProgram: { envVersion }
} = wx.getAccountInfoSync();

const config = {
  // 开发版
  develop: {
    baseURL: 'http://121.37.240.115:3000/mock/654',
    staticResUrl: 'http://test-resource-platform.socialmind.com.cn/huaer-fund-marketing/res',
    qiniuDomain: 'https://iag-qiniu-test.weijuju.com/'
  },
  // 体验版
  trial: {
    baseURL: 'https://fund-applet-test.socialmind.com.cn',
    staticResUrl: 'http://test-resource-platform.socialmind.com.cn/huaer-fund-marketing/res',
    qiniuDomain: 'https://iag-qiniu-test.weijuju.com/'
  },
  // 正式版
  release: {
    baseURL: '',
    staticResUrl: '',
    qiniuDomain: ''
  }
};

export default config[envVersion];
