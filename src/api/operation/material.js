import request from '@/utils/request';
//分页
export const pageQuery = (data) => {
  return request({
    url: '/admin/WtGameSource/pageQuery',
    method: 'post',
    data
  })
};
export const deleteGame = (params) => {
  return request({
    url: '/admin/WtGameSource/del',
    method: 'get',
    params
  })
};
export const save = (data) => {
  return request({
    url: '/admin/WtGameSource/save',
    method: 'post',
    data
  })
};

export const findOne = (params) => {
  return request({
    url: '/admin/WtGameSource/findOne',
    method: 'get',
    params
  })
};
