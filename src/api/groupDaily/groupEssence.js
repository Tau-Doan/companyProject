import request from '@/utils/request';

/**
 * 删除群精华
 * @param params
 */
export const del = (params) => {
  return request({
    url: '/admin/wtGroupEssence/delete',
    method: 'get',
    params
  })
};

/**
 * 分享群精华
 * @param params
 */
export const share = (params) => {
  return request({
    url: '/admin/wtGroupEssence/share',
    method: 'get',
    params
  })
};

/**
 * 根据id查询
 * @param params
 */
export const findOne = (params) => {
  return request({
    url: '/admin/wtGroupEssence/findOne',
    method: 'get',
    params
  })
};
/**
 * 分页查询群精华
 * @param data
 */
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtGroupEssence/index',
    method: 'post',
    data
  })
};

/**
 * 添加分享群数据
 * @param data
 */
export const addShareGroups = (data) => {
  return request({
    url: 'admin/wtGroupEssence/addShareGroups',
    method: 'post',
    data
  })
};

/**
 * 保存群精华
 * @param data
 */
export const save = (data) => {
  return request({
    url: '/admin/wtGroupEssence/save',
    method: 'post',
    data
  })
};

/**
 * 查询消息记录
 * @param data
 */
export const findMessageList = (data) => {
  return request({
    url: '/admin/wtMessage/findMessageList',
    method: 'post',
    data
  })
};
