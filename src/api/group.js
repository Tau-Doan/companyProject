import request from '@/utils/request';

/**
 * 获取所有的机构和群
 */
export const findDeptGroupTree = () => {
  return request({
    // url: '/system/dept/findDeptGroupTree',
    url:'/admin/wtGroup/findGroupByUserId',
    method: 'get',
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
//获得小助手二维码
export const getAssistant = (params) => {
  return request({
    url: '/admin/wtRobot/findOneOrderBy',
    method: 'get',
    params
  })
};

