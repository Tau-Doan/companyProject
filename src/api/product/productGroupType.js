import request from '@/utils/request'

/**
 * 查询所有群产品类型
 * @param data
 */
export const findAll = () => {
  return request({
    url: '/admin/wtProductGroupType/findAll',
    method: 'get',
  })
};

// 查询群组列表
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtProductGroupType/pageQuery',
    method: 'post',
    data
  })
};

/**
 * 保存产品类型
 * @param data
 */
export const save = (data) => {
  return request({
    url: '/admin/wtProductGroupType/save',
    method: 'post',
    data
  })
};

/**
 * 根据id查询
 * @param id
 */
export const findOne = (id) => {
  return request({
    url: '/admin/wtProductGroupType/findOne',
    method: 'get',
    params: {id}
  })
};
/**
 * 根据ids删除
 * @param data
 */
export const dels = (data) => {
  return request({
    url: '/admin/wtProductGroupType/dels',
    method: 'post',
    data
  })
};
