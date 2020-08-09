import request from '@/utils/request'

// 查询所有的部门数据
export const findAll = (params) => {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params
  })
};
// 根据部门id查询群数据
export const findGroupByDeptId = (params) => {
  return request({
    url: '/admin/wtGroup/findGroupByDeptId',
    method: 'get',
    params
  })
};
// 查询消息
export const pageQueryMessageList = (data) => {
  return request({
    url: '/admin/wtMessage/pageQueryMessageList',
    method: 'post',
    data
  })
};
//群组
export const findDeptGroupTree = () => {
  return request({
    // url: '/system/dept/findDeptGroupTree',
    url:'/admin/wtGroup/findGroupByUserId',
    method: 'get',
  })
};
