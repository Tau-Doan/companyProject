import { login, logout, getInfo ,mobileLogin,weChatCodeLogin} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    rechargeHintVisible: false, // 充值提示
    expireTime: '',
    productTypeId: '',
    ifAddRobot:'',
    cipher:''
  },

    mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PRODUCT_TYPE_ID: (state,productTypeId) => {
      state.productTypeId = productTypeId;
    },
    SET_EXPIRE_TIME: (state,expireTime) => {
      state.expireTime = expireTime;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_RECHARGE_HINT_VISIBLE: (state,rechargeHintVisible) => {
      state.rechargeHintVisible = rechargeHintVisible
    },

    SET_IF_ADD_ROBOT:(state, ifAddRobot)=>{
      state.ifAddRobot= ifAddRobot
    },
    SET_CIPHER:(state,cipher)=>{
      state.cipher=cipher
    }
  },

  actions: {
    /**
     * 更新充值提示
     * @constructor
     */
    UpdateRechargeHintVisible({commit},rechargeHintVisible) {
      commit('SET_RECHARGE_HINT_VISIBLE',rechargeHintVisible);
    },
    //点击取消助手弹窗
    UpdateIfAddRobot({commit},ifAddRobot){
      commit('SET_IF_ADD_ROBOT',ifAddRobot);
    },
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token);
          commit('SET_TOKEN', res.token);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    //手机登录
    PhoneLogin({ commit }, userInfo){
      const mobile = userInfo.mobile;
      const code = userInfo.phoneCode;
      return new Promise( async (resolve, reject) => {
        await mobileLogin({mobile, code}).then(res => {
          setToken(res.token);
          commit('SET_TOKEN', res.token);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    WeChatCodeLogin({ commit }, code){
      return new Promise( async (resolve, reject) => {
        await weChatCodeLogin({code}).then(res => {
          setToken(res.token);
          commit('SET_TOKEN', res.token);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.user;
          let avatar = !user.avatar ? require("@/assets/image/profile.jpg") : user.avatar;
          // 如果头像不是http开头则拼接后台地址
          !avatar.startsWith("http") && (avatar = process.env.VUE_APP_BASE_API + user.avatar)
          // 获取用户会员相关数据
          const {productTypeId,expireTime,ifAddRobot,cipher} = res.user;

          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles);
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName);
          commit('SET_AVATAR', avatar);
          commit('SET_PRODUCT_TYPE_ID', productTypeId);
          commit('SET_IF_ADD_ROBOT',  ifAddRobot);
          commit('SET_CIPHER',  cipher);
          commit('SET_EXPIRE_TIME', expireTime ? new Date(expireTime).getTime() : null);
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_PERMISSIONS', []);
          removeToken();
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve()
      })
    },
    /**
     * 更新用户产品id和过期时间
     * @param commit
     * @param productId 产品id
     * @param expireTime g过期时间
     * @returns {Promise<unknown>}
     * @constructor
     */
    UpdateUserInfo({ commit },{productId,expireTime}) {
      return new Promise(resolve => {
        commit('SET_EXPIRE_TIME',expireTime);
        commit('SET_PRODUCT_TYPE_ID',productId);
        resolve();
      })
    }
  }
};

export default user
