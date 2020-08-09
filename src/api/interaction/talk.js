import request from '@/utils/request';
// 分页查询
export const pageQuery = (data) => {
  return request({
    url: '/admin/wtTalk/pageQuery',
    method: 'post',
    data
  })
};
// 获取目标群
export const getGroupList = (params) => {
  return request({
    url: '/admin/wtTalk/getGroupList',
    method: 'get',
    params
  })
};


//保存规则
export const save = (data) => {
  return request({
    url: '/admin/wtTalk/save',
    method: 'post',
    data
  })
};


//话题排行榜
export const pageQueryTalkMemberRankingList = (data) => {
  return request({
    url: '/admin/wtTalk/pageQueryTalkMemberRankingList',
    method: 'post',
    data
  })
};

export const getTalkRankingList = (data) => {
  return request({
    url: '/admin/wtTalk/getTalkRankingList',
    method: 'post',
    data
  })
};
