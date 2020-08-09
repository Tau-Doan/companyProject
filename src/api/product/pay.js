import request from '@/utils/request'

/**
 * 微信二维码支付
 * @param productId 产品id
 */
export const weChatQrCode = (productId) => {
  return request({
    url: '/pay/weChat/qrCode',
    method: 'post',
    params: {productId}
  });
};

/**
 * 查询微信订单状态
 * @param orderId 订单id
 */
export const queryWeChatPayStatus = (orderId) => {
  return request({
    url: '/pay/weChat/queryPayStatus',
    method: 'post',
    params: {orderId}
  });
};

/**
 * 支付宝二维码支付
 * @param productId 产品id
 */
export const aliQrCode = (productId) => {
  return request({
    url: '/pay/ali/qrCode',
    method: 'post',
    params: {productId}
  });
};


/**
 * 查询支付宝订单状态
 * @param orderId 订单id
 */
export const queryAliPayStatus = (orderId) => {
  return request({
    url: '/pay/ali/queryPayStatus',
    method: 'post',
    params: {orderId}
  });
};
