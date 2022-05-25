const {
  miniProgram: { envVersion }
} = wx.getAccountInfoSync();

export const AUTH_TOKEN_KEY = `${envVersion}_auth_token`;

export const LAST_TOKEN_TIME_KEY = `${envVersion}_last_token_time`;

export const CURRENT_PAGE_PATH_KEY = `${envVersion}_current_page_path`;

export const COMPLAINTS_REASON_LIST = ['虚假活动、活动不真实', '奖品没到账', '活动流程有误', '色情、暴力', '其他'];
