import request from '@/utils/request'

/**
 * 查询所有产品类型
 * @param data
 */
export const findAll = () => {
  return request({
    url: '/admin/wtProductType/findAll',
    method: 'get',
  })
};

// 查询群组列表
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtProductType/pageQuery',
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
    url: '/admin/wtProductType/save',
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
    url: '/admin/wtProductType/findOne',
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
    url: '/admin/wtProductType/dels',
    method: 'post',
    data
  })
};
