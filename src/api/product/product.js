import request from '@/utils/request'

// 查询群组列表
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtProduct/pageQuery',
    method: 'post',
    data
  })
};

/**
 * 保存产品
 * @param data
 */
export const save = (data) => {
  return request({
    url: '/admin/wtProduct/save',
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
    url: '/admin/wtProduct/findOne',
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
    url: '/admin/wtProduct/dels',
    method: 'post',
    data
  })
};

/**
 * 查询所有的产品
 */
export const findProducts = () => {
  return request({
    url: '/admin/wtProduct/findAll',
    method: 'get',
  })
};

