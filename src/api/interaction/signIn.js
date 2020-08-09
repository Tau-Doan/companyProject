import request from '@/utils/request';

export const pageQuery = (data) => {
  return request({
    url: '/admin/WtSignInInfo/pageQuery',
    method: 'post',
    data
  })
};
//保存规则
export const save = (data) => {
  return request({
    url: '/admin/wtSignInRule/save',
    method: 'post',
    data
  })
};
//查询签到规则
export const findSignInRule = (params) => {
  return request({
    url: '/admin/wtSignInRule/findSignInRule',
    method: 'get',
    params
  })
};
//分页查询签到信息
export const pageQueryGroupSignInfo = (data) => {
  return request({
    url: '/admin/WtSignInInfo/pageQueryGroupSignInfo',
    method: 'post',
    data
  })
};
//获取签到详情
export const getMemberSignInfo = (params) => {
  return request({
    url: '/admin/WtSignInInfo/getMemberSignInfo',
    method: 'get',
    params
  })
};
