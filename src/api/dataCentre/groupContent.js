import request from '@/utils/request';

export const findAll = (params) => {
  return request({
    url: '/admin/wtGroup/findAll',
    method: 'get',
    params
  })
};

export const getGroupContentStatistics = (data) => {
  return request({
    url: '/admin/statistics/getGroupContentStatistics',
    method: 'post',
    data
  })
};
