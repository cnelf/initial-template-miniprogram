import env from '@/api/env';

export const getImageUrl = (path = '') => {
  if (!path) return path;
  if (/^https?:\/\/(.*)/.test(path)) {
    return path;
  }
  if (path.indexOf('#qiniu') > -1) {
    return env.qiniuDomain + path;
  }
  return `${env.staticResUrl + path}?v=1`;
};
