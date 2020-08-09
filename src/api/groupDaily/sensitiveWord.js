import request from '@/utils/request';

//获取敏感词信息
export const getInfo = (data) => {
  return request({
    url: '/admin/wtMessageSensitiveHitLog/getInfo',
    method: 'post',
    data
  })
};

//保存敏感词
export const save = (params) => {
  return request({
    url: '/admin/wtMessageSensitiveHitLog/modifyForLog',
    method: 'get',
    params
  })
};
//保存处理方式
export const modify = (data) => {
  return request({
    url: '/admin/wtMessageSensitiveHitLog/modify',
    method: 'post',
    data
  })
};
//查询消息
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtMessageSensitiveHitLog/pageQuery',
    method: 'post',
    data
  })
};
