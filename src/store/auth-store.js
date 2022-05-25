import { AUTH_TOKEN_KEY, LAST_TOKEN_TIME_KEY } from '@constants/index';
import { fetchAuthToken, fetchAuthTel } from '@api/index';
import { autoLoading } from '@utils/index';
import Fly from '@lib/flyio';
import env from '@api/env';

const fly = new Fly();

fly.config.baseURL = env.baseURL;
fly.config.timeout = 30000;

class AuthStore {
  constructor() {
    this.$authToken = wx.getStorageSync(AUTH_TOKEN_KEY);
  }

  get authToken() {
    return this.$authToken;
  }

  set authToken(val) {
    this.$authToken = val;
    wx.setStorageSync(AUTH_TOKEN_KEY, val);
    wx.setStorageSync(LAST_TOKEN_TIME_KEY, new Date().getTime());
  }

  async login() {
    const app = getApp();
    const { actId } = app.store.getState();
    const { code } = await wx.login();
    const { data } = await fly.get('/applet/oauth/getAuthToken', {
      authCode: code,
      adminUid: env.adminUid,
      activityId: actId,
      platformType: 0
    });
    if (data.code === 200) {
      const {
        data: { authToken }
      } = data;
      this.authToken = authToken;
    }
  }

  async checkToken(request) {
    if (wx.getStorageSync(LAST_TOKEN_TIME_KEY)) {
      const lastTokenTime = wx.getStorageSync(LAST_TOKEN_TIME_KEY);
      // forceAuth 强制重新进行静默授权 || token 默认两天后失效
      if (request.forceAuth || new Date().getTime() - lastTokenTime > 2 * 24 * 60 * 60 * 1000) {
        this.authToken = '';
        return this.login();
      }
    }
  }

  // 授权用户基本信息
  async authUserProfile() {
    const app = getApp();
    const { actId } = app.store.getState();
    // login方法不能使用await，否则调不起授权
    let code = '';
    wx.login().then((res) => {
      code = res.code;
    });
    const { encryptedData, iv } = await wx.getUserProfile({ lang: 'zh_CN', desc: '用于展示用户头像和昵称' });
    if (encryptedData && iv) {
      await autoLoading(
        fetchAuthToken({
          adminUid: env.adminUid,
          activityId: actId,
          platformType: 0,
          authCode: code,
          encryptInfo: encryptedData,
          iv
        })
      );
    }
  }

  // 授权用户手机号
  async authTel({ code, encryptedData, iv }) {
    wx.checkSession()
      .then(async () => {
        if (encryptedData && iv) {
          await autoLoading(
            fetchAuthTel({
              authCode: code,
              encryptInfo: encryptedData,
              iv
            })
          );
        }
      })
      .catch(() => {
        // 在外部重新调用wx.login
        throw new Error('登录已失效，请重新点击授权');
      });
  }
}

export const authStore = new AuthStore();
