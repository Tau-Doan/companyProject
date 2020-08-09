import fa from "element-ui/src/locale/lang/fa";

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  rechargeHintVisible: state => state.user.rechargeHintVisible,
  cipher:state=>state.user.cipher,
  ifAddRobot:state=>{
    if(state.user.ifAddRobot===''){
      state.user.ifAddRobot=false
      return
    }
    return state.user.ifAddRobot ? false:true
  }
}
export default getters
