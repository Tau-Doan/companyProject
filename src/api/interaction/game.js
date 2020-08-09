import request from '@/utils/request';
export const getAll = (params) => {
  return request({
    url: '/admin/WtGameRule/getAll',
    method: 'get',
    params
  })
};

export const getGroupList = (params) => {
  return request({
    url: '/admin/WtGameRule/getGroupList',
    method: 'get',
    params
  })
};

export const getGameDetail = (data) => {
  return request({
    url: '/admin/wtGameSourceVersion/getGameDetail',
    method: 'post',
    data
  })
};

export const save = (data) => {
  return request({
    url: '/admin/WtGameRule/save',
    method: 'post',
    data
  })
};

export const findOne = (params) => {
  return request({
    url: 'admin/WtGameRule/findOne',
    method: 'get',
    params
  })
};
//开启和关闭
export const openGame = (params) => {
  return request({
    url: 'admin/WtGameRule/open',
    method: 'get',
    params
  })
};
export const closeGame = (params) => {
  return request({
    url: 'admin/WtGameRule/close',
    method: 'get',
    params
  })
}
