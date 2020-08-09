import request from '@/utils/request'

// 查询群组列表
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtGroup/index',
    // url: '/system/user/allUser',
    // method:'get',
    method: 'post',
    data
  })
};

//刷新群组信息
export const updateGroup = (params) => {
  return request({
    url: 'admin/wtGroup/getAllGroup',
    method: 'post',
    params
  })
};

//更新群二维码
export const updateQRCode = (params) => {
  return request({
    url: '/admin/wtGroup/updateCode',
    method: 'get',
    params
  })
};
//获取二维码
export const getCode = (params) => request({
  url:'/admin/wtGroup/getCode',
  method: 'get',
  params
});
//修改群消息
export const editGroupMessage = (data) => request({
  url:'/admin/wtGroup/update',
  method: 'post',
  data
});

//刷新成员信息
export const updateGroupMember = (params) => request({
  url:'/admin/wxGroupMember/updateGroupMember',
  method: 'get',
  params
});

//刷新成员信息
export const deleteGroup = (params) => request({
  url:'/admin/wtGroup/delGroup',
  method: 'get',
  params
});

//获取机构
export const getTreeDepts = (params) => request({
  url:'/system/dept/treeselect',
  method: 'get',
  params
});
//获取群信息
export const getGroupInfo = () => request({
  url:'/system/user/allUser',
  method: 'get',
  // data
})
