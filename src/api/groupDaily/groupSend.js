import request from '@/utils/request'
/**
 * 获取群发信息详情
 * @param params
 * @returns {*}
 */
export const findApprovalDetails = (params) => {
  return request({
    url: '/admin/wtGroupSend/findExamineDetail',
    method: 'get',
    params
  })
};
/**
 * 获取群发消息目标群列表
 * @param params
 */
export const getGroupList = (params) => {
  return request({
    url: '/admin/wtGroupSend/getGroupList',
    method: 'get',
    params
  })
};

/**
 * 删除群发消息
 * @param params
 */
export const delGroupSend = (params) => {
  return request({
    url: '/admin/wtGroupSend/del',
    method: 'get',
    params
  })
};

/**
 * 发送消息
 * @param params
 */
export const sendAgain = (params) => {
  return request({
    url: '/admin/wtGroupSend/getGroupList',
    method: 'get',
    params
  })
};

/**
 * 审核群发信息
 * @param data
 */
export const auditingGroupSend = (data) => {
  return request({
    url: '/admin/wtGroupWelcome/findOne',
    method: 'post',
    data
  })
};

/**
 * 分页查询群发消息
 * @param data
 */
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtGroupSend/pageQuery',
    method: 'post',
    data
  })
};

/**
 * 分页查询审核列表
 * @param data
 */
export const pageQueryAuditingList = (data) => {
  return request({
    url: '/admin/wtGroupSend/pageQueryAuditingList',
    method: 'post',
    data
  })
};

/**
 * 保存群发消息
 * @param data
 */
export const save = (data) => {
  return request({
    url: '/admin/wtGroupSend/save',
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
