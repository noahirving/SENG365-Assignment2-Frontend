import { createStore } from 'vuex'

export default createStore({
  state: {
    token: null,
  },
  mutations: {
    set_auth(state, token) {
      state.token = token
    },
    remove_auth(state) {
      state.token = null;
    }
  },
  actions: {
    setAuth({commit}, token) {
      commit('set_auth', token);
    },
    removeAuth({commit}) {
      commit('remove_auth');
    }
  },
  getters: {
    getAuth(state) {
      return state.token;
    },
    isLoggedIn(state) {
      return state.token != null;
    }
  }
})
