import request from '@/utils/request';

export const findAll = (params) => {
  return request({
    url: '/admin/wtGroup/findAll',
    method: 'get',
    params
  })
};

export const pageQueryGroupMemberStatistics = (data) => {
  return request({
    url: '/admin/statistics/pageQueryGroupMemberStatistics',
    method: 'post',
    data
  })
};

export const getMemberUpperLowerLevelsStatistics = (data) => {
  return request({
    url: '/admin/statistics/getMemberUpperLowerLevelsStatistics',
    method: 'post',
    data
  })
};
