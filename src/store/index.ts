import { createStore } from 'vuex'

export default createStore({
  state: {
    loggedIn: false,
    token: null,

  },
  mutations: {
    set_login(state) {
      state.loggedIn = !state.loggedIn;
    }
  },
  actions: {
    setLogin({commit}) {
      commit('set_login');
    }
  },
  getters: {
    loggedIn(state) {
      return state.loggedIn || false;
    }
  },
  modules: {
  }
})
