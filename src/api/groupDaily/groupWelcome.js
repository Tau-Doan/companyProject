import request from '@/utils/request'

/**
 * 分页查询数据
 * @param data 请求数据
 */
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtGroupWelcome/pageQuery',
    method: 'post',
    data
  })
};

/**
 * 获取入群欢迎语目标群
 * @param id
 */
export const getGroupList = (params) => {
  return request({
    // url: '/admin/wtGroupWelcome/getGroupList',
    url:'/admin/wtGroup/findGroupByUserId',

    method: 'get',
    params
  })
};

/**
 * 删除入群欢迎语
 * @param id
 */
export const del = (params) => {
  return request({
    url: '/admin/wtGroupWelcome/del',
    method: 'get',
    params
  })
};

/**
 * 保存入群欢迎语
 * @param data
 */
export const save = (data) => {
  return request({
    url: '/admin/wtGroupWelcome/save',
    method: 'post',
    data
  })
};
/**
 * 根据id查询数据
 * @param data
 */
export const findOne = (params) => {
  return request({
    url: '/admin/wtGroupWelcome/findOne',
    method: 'get',
    params
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

