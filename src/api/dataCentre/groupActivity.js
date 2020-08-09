import request from '@/utils/request';

export const findAll = (params) => {
  return request({
    url: '/admin/wtGroup/findAll',
    method: 'get',
    params
  })
};

export const pageQueryGroupLivenessStatistics = (data) => {
  return request({
    url: '/admin/statistics/pageQueryGroupLivenessStatistics',
    method: 'post',
    data
  })
};

export const pageQueryGroupLivenessByTimeQuantumStatistics = (data) => {
  return request({
    url: '/admin/statistics/pageQueryGroupLivenessByTimeQuantumStatistics',
    method: 'post',
    data
  })
};


export const exportGroupActivity =(query) => {
  return request({
    url: '/admin/statistics/exportGroupLiveness2Excel',
    method: 'get',
    params: query
  })
}
