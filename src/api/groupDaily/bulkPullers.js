import request from '@/utils/request'

// 批量邀请人
export const batchInGroup = (data) => {
  return request({
    url: '/admin/batchInGroup/batchInGroup',
    method: 'post',
    data
  })
};
// 查询用户
export const findMemberByRobotId = (data) => {
  return request({
    url: '/admin/batchInGroup/findMemberByRobotId',
    method: 'post',
    data
  })
};
// 获取群信息
export const findWtGroupByRobotId = (data) => {
  return request({
    url: '/admin/batchInGroup/findWtGroupByRobotId',
    method: 'post',
    data
  })
};
// 获取所有的助手号
export const getAllWtRobot = (data) => {
  return request({
    url: '/admin/batchInGroup/getAllWtRobot',
    method: 'post',
    data
  })
};
