import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}

// 获取验证码phone
export const getCodePhone = (params) => {
  return request({
    url: '/sendMobileCode',
    method: 'get',
    params
  })
};

// 手机登录
export const mobileLogin = (data) => {
  return request({
    url: '/mobileLogin',
    method: 'post',
    data
  })
};

/**
 * 微信扫码登陆
 * @param params
 */
export const weChatCodeLogin = (params) => {
  return request({
    url: 'weChatCodeLogin',
    method: 'post',
    params
  })
};
