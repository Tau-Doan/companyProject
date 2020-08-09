import request from '@/utils/request';
// 分页查询
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtVote/pageQuery',
    method: 'post',
    data
  })
};
// 获取目标群
export const getGroupList = (params) => {
  return request({
    url: '/admin/wtVote/getGroupList',
    method: 'get',
    params
  })
};


export const save = (data) => {
  return request({
    url: '/admin/wtVote/save',
    method: 'post',
    data
  })
};

export const pageQueryVoteResult = (data) => {
  return request({
    url: '/admin/wtVote/pageQueryVoteResult',
    method: 'post',
    data
  })
};


export const pageQueryMemberVoteList = (data) => {
  return request({
    url: '/admin/wtVote/pageQueryMemberVoteList',
    method: 'post',
    data
  })
};
