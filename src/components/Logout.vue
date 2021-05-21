<template>
  <el-button v-if="loggedIn" @click="logout" :key="isLoggedIn">Logout</el-button>
</template>

<script>
import {mapActions, mapGetters} from "vuex/dist/vuex.mjs";

export default {
  name: "Logout",
  methods: {
    async logout() {
      console.log(window.sessionStorage.getItem('token'))
      //window.sessionStorage.removeItem('token');
      this.setLogin();

      const headers = {'X-Authorization': window.sessionStorage.getItem('token')}
      const response = await this.axios.post('users/logout', {}, {headers});
      console.log(response);
      window.sessionStorage.clear();
      window.sessionStorage.removeItem('token');
    },
    ...mapActions({
      setLogin: 'setLogin',
    }),
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
    }),
  }
}
</script>

<style scoped>

</style>