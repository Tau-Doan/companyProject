import request from '@/utils/request';

export const save = (data) => {
  return request({
    url: '/admin/WtAutomaticAnswer/save',
    method: 'post',
    data
  })
};
export const getAutomaticAnswer = (params) => {
  return request({
    url: '/admin/WtAutomaticAnswer/getAutomaticAnswer',
    method: 'get',
    params
  })
};
