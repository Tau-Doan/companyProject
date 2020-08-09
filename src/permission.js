import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'


NProgress.configure({ showSpinner: false });

const whiteList = ['/login','/auth-redirect', '/bind', '/register'];

/**
 * 处理充值提示
 * @param to 跳转路由
 */
const handleRechargeHint = to => {
  // 全局提示充值组件
  const {expireTime,productTypeId} = store.state.user;
  // 收费
  const toll = to.meta.toll;
  // 用户角色信息
  const roles = store.getters.roles;

  // 用户为admin直接放行
  if(roles.includes('admin')){
    return false;
  }

  const nowTime = new Date().getTime();
  // 当前组件收费，并且当前产品id不为0，并且过期时间大于当前时间
  store.dispatch('UpdateRechargeHintVisible',toll && !(productTypeId && expireTime > nowTime));

}
/*
* 处理小助手
* */
const handleAssistant=to=>{
  const {expireTime,productTypeId} = store.state.user;
  // 收费
  const toll = to.meta.toll;
  // 用户角色信息
  const roles = store.getters.roles;

  // 当前组件收费，并且当前产品id不为0，并且过期时间大于当前时间
  // store.dispatch('UpdateIfAddRobot',toll && !(ifAddRobot));
}
/**
 * 全局路由守卫
 */
router.beforeEach((to, from, next) => {

  NProgress.start();
  if (getToken()) {
    /* has token*/
    if (to.path === '/login' || to.path ==='/phoneLogin') {
      next({ path: '/' });
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles;
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
          // 测试 默认静态页面
          // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes); // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err);
              next({ path: '/' })
            })
          })
      } else {
        // 处理充值提示组件
        handleRechargeHint(to);
        handleAssistant(to)
        next()
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        // 可删 ↑
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done()
});
