import request from '@/utils/request';

export const findGroupHealthTrend = (data) => {
  return request({
    url: '/admin/statistics/findGroupHealthTrend',
    method: 'post',
    data
  })
};
