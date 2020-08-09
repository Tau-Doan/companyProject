import request from '@/utils/request'

/**
 * 获取广告监控
 * @param data
 */
export const getAdMonitor = (data) => {
  return request({
    url: '/admin/adMonitor/getAdMonitor',
    method: 'post',
    data
  })
};

/**
 * 修改广告监控
 * @param data
 */
export const modify = (data) => {
  return request({
    url: '/admin/adMonitor/modify',
    method: 'post',
    data
  })
};
