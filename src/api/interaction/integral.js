import request from '@/utils/request';
// 分页查询
export const pageQueryIntegralStatisticsInfo = (data) => {
  return request({
    url: '/admin/wtExchangeLog/pageQueryIntegralStatisticsInfo',
    method: 'post',
    data
  })
};


export const updateIntegralExchangeConfig = (params) => {
  return request({
    url: '/admin/wtExchangeLog/updateIntegralExchangeConfig',
    method: 'get',
    params
  })
};
export const getIntegralExchangeConfig = (params) => {
  return request({
    url: '/admin/wtExchangeLog/getIntegralExchangeConfig',
    method: 'get',
    params
  })
};

export const getMemberIntegralDetails = (data) => {
  return request({
    url: '/admin/wtExchangeLog/getMemberIntegralDetails',
    method: 'post',
    data
  })
};

export const pageQuery = (data) => {
  return request({
    url: '/admin/wtExchangeLog/pageQuery',
    method: 'post',
    data
  })
};


