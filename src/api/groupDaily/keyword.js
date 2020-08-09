import request from '@/utils/request'

// 查询群组列表
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtKeyword/pageQuery',
    method: 'post',
    data
  })
};

// 删除群列表
export const deleteKeyword = (params) => {
  return request({
    url: '/admin/wtKeyword/del',
    method: 'get',
    params
  })
};
// 查看群列表
export const getGroupList = (params) => {
  return request({
    url: '/admin/wtKeyword/getGroupList',
    method: 'get',
    params
  })
};


export const findOne = (params) => {
  return request({
    url: '/admin/wtKeyword/findOne',
    method: 'get',
    params
  })
};


//保存关键词
export const save = (data) => {
  return request({
    url: 'admin/wtKeyword/save',
    method: 'post',
    data
  })
};
// 查询目标群
export const findGroup = (params) => {
  return request({
    url: '/admin/wtMessageMonitor/getGroupList',
    method: 'get',
    params
  })
};
