import request from '@/utils/request';


/**
 * 获取入群欢迎语目标群
 * @param id
 */
export const getGroupList = (params) => {
  return request({
    url: '/admin/wtMessageMonitor/getGroupList',
    method: 'get',
    params
  })
};

/**
 * 分页查询数据
 * @param data 请求数据
 */
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtMessageMonitor/pageQuery',
    method: 'post',
    data
  })
};

/**
 * 保存数据
 * @param data
 */
export const save = (data) => {
  return request({
    url: 'admin/wtMessageMonitor/save',
    method: 'post',
    data
  })
};

/**
 * 删除消息监控
 * @param id
 */
export const del = (params) => {
  return request({
    url: '/admin/wtMessageMonitor/del',
    method: 'get',
    params
  })
};


/**
 * 查询命中记录
 * @param params
 */
export const getMatchingMessageList = (params) => {
  return request({
    url: '/admin/wtMessageMonitor/getMatchingMessageList',
    method: 'get',
    params
  })
};

/**
 * 根据id查询内容
 * @param params
 */
export const findOne = (params) => {
  return request({
    url: '/admin/wtMessageMonitor/findOne',
    method: 'get',
    params
  })
};
