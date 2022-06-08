import env from './env';
import Fly from '@/lib/flyio';
import { AUTH_TOKEN_KEY } from '@/constants/index';
import { userAuth } from '@/utils/index';

const fly = new Fly();

fly.config.baseURL = env.baseURL;
fly.config.timeout = 30000;
fly.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

fly.interceptors.request.use((request) => {
  fly.lock();
  return userAuth
    .checkToken(request)
    .then(() => {
      request.headers['AuthToken'] = wx.getStorageSync(AUTH_TOKEN_KEY);
      return request;
    })
    .finally(() => {
      fly.unlock();
    });
});

let retryTimes = 5; // 重试5次

fly.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code !== 200) {
      // token已失效
      if (data.code === 3001 && retryTimes--) {
        fly.lock();
        return userAuth
          .login()
          .finally(() => {
            fly.unlock();
          })
          .then(() => {
            // 重新发起请求
            return fly.request(response.request);
          });
      }
      // 在外部捕获处理自定义异常
      return Promise.reject(data);
    }
    retryTimes = 5;
    return data;
  },
  (error) => {
    const response = error.response;
    // token已失效
    if (response.status === 401 && retryTimes--) {
      fly.lock();
      return userAuth
        .login()
        .finally(() => {
          fly.unlock();
        })
        .then(() => {
          // 重新发起请求
          return fly.request(error.request);
        });
    }
    return Promise.reject(error);
  }
);

export default fly;
