import fly from './request';

const reqPath = {
  common: {
    authToken: '/applet/oauth/getAuthToken',
    authTel: '/applet/mobile/getAuthTel',
    complainInfo: '/applet/mobile/act/complainInfo'
  }
};

// 基本信息授权
export const fetchAuthToken = params => fly.get(reqPath.common.authToken, params);

// 授权手机号
export const fetchAuthTel = params => fly.get(reqPath.common.authTel, params);

// 用户投诉
export const fetchActComplainInfo = params => fly.post(reqPath.common.complainInfo, params);
