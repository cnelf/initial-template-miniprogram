// 整数
export const integerReg = /^\d{1,}$/;

// 数字或浮点数
export const numberReg = /^\d+$|^\d+[.]?\d+$/;

// 数字仅包含两位小数
export const limitDecimalReg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;

// 数字或字母
export const numberAndLettersReg = /^[A-Za-z0-9]$/;

// 6-12位数字或字母密码
export const sixToTwelveNumberAndLettersReg = /^[A-Za-z0-9]{6,12}$/;

// 手机号
export const telReg = /^(?:(?:\+|00)86)?1\d{10}$/;

// 电子邮箱
export const emailReg =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// 基金代码
export const fundCodeReg = /^\d{6}$/;

// 指数代码
export const indexCodeReg = /^\d{6}\.\w{2}$/;
