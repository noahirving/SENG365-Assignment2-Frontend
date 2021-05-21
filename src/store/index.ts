import { createStore } from 'vuex'

export default createStore({
  state: {
    token: null,
    userId: null
  },
  mutations: {
    set_auth(state, {token, userId}) {
      state.token = token;
      state.userId = userId;
    },
    remove_auth(state) {
      state.token = null;
      state.userId = null;
    }
  },
  actions: {
    setAuth({commit}, {token, userId}) {
      commit('set_auth', {token, userId});
    },
    removeAuth({commit}) {
      commit('remove_auth');
    }
  },
  getters: {
    getAuth(state) {
      return state.token;
    },
    getUserId(state) {
      return state.userId;
    },
    isLoggedIn(state) {
      return state.token != null;
    }
  }
})
