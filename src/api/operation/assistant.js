import request from '@/utils/request';
//刷新助手号
export const refershRobot = (data) => {
  return request({
    url: '/admin/wtRobot/refershRobot',
    method: 'post',
    data
  })
};

//分页
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtRobot/index',
    method: 'post',
    data
  })
};

export const getGroupList = (params) => {
  return request({
    url: 'admin/wtRobot/getGroupList',
    method: 'get',
    params
  })
};
export const modifyPurpose = (data) => {
  return request({
    url: '/admin/wtRobot/modifyPurpose',
    method: 'post',
    data
  })
};
