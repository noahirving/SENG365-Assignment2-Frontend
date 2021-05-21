<template>
  <el-card class="box-card">
    <template #header>
      <el-header>Login</el-header>
    </template>
    <el-form>
      <el-form-item label="Email">
        <el-input v-model="email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="login">Login</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import NavBar from "@/components/NavBar";
import {mapActions, mapGetters} from "vuex/dist/vuex.mjs";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    async login() {
      try {
        const response = await this.axios.post('users/login', {
          "email": this.email,
          "password": this.email
        });
        if (response.status === 200) {
          const {userId, token} = response.data;
          window.sessionStorage.setItem("userId", userId);
          window.sessionStorage.setItem("token", token);
          await this.$router.push("/");
          this.setLogin();
        }
      } catch (e) {
        console.log(e);
      }
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>