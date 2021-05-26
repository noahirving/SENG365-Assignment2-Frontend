<template>
  <!-- Buttons -->
  <el-button type="primary" v-if="isLoggedIn" @click="logout">Logout</el-button>
  <template v-if="!isLoggedIn">
    <el-button type="primary" @click="loginVisible = true">Login</el-button>
    <el-button type="info" @click="registerVisible = true">Register</el-button>
  </template>

  <!-- Login dialog -->
  <el-dialog
    title="Login"
    v-model="loginVisible">
    <el-form :model="loginForm">
      <el-form-item label="Email" :label-width="labelWidth">
        <el-input v-model="loginForm.email" autocomplete="off" :maxlength="inputWidth"/>
      </el-form-item>
      <el-form-item label="Password" :label-width="labelWidth" >
        <el-input type="password" v-model="loginForm.password" autocomplete="off" :maxlength="inputWidth"/>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="loginVisible = false">Cancel</el-button>
      <el-button type="primary" @click="login()">Login</el-button>
    </span>
    </template>
  </el-dialog>

  <!-- Register dialog -->
  <el-dialog
      title="Register"
      v-model="registerVisible">
    <el-form :model="registerForm">
      <el-form-item label="First Name" :maxlength="labelWidth">
        <el-input v-model="registerForm.firstName" :maxlength="inputWidth"/>
      </el-form-item>
      <el-form-item label="Last Name" :maxlength="labelWidth">
        <el-input v-model="registerForm.lastName" :maxlength="inputWidth"/>
      </el-form-item>
      <el-form-item label="Email" :maxlength="labelWidth">
        <el-input v-model="registerForm.email" autocomplete="off" :maxlength="inputWidth"/>
      </el-form-item>
      <el-form-item label="Password" :maxlength="labelWidth">
        <el-input type="password" v-model="registerForm.password" autocomplete="off" :maxlength="inputWidth"/>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="registerVisible = false">Cancel</el-button>
      <el-button type="primary" @click="register()">Login</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex/dist/vuex.mjs";
import users from "@/api/users";

export default {
  name: "Login",
  data() {
    return {
      loginVisible: false,
      loginForm: {
        email: "",
        password: ""
      },
      registerVisible: false,
      registerForm: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
      labelWidth: "120px",
      inputWidth: "260px"
    }
  },
  methods: {
    async register() {
      try {
        const response = await users.register(
            this.registerForm.firstName,
            this.registerForm.lastName,
            this.registerForm.email,
            this.registerForm.password
        )
        if (response.status === 201) {
          this.registerVisible = false;
          this.loginForm.email = this.registerForm.email;
          this.loginForm.password = this.registerForm.password;
          await this.login();
        }
        console.log(response);
      } catch (e) {
        console.log(e);
      }

    },
    async login() {
      try {
        const {status, data} = await users.login(this.loginForm.email, this.loginForm.password);
        if (status === 200) {
          const {userId, token} = data;
          this.setAuth({token, userId});
          this.axios.defaults.headers.common['X-Authorization'] = token;
          this.loginVisible = false;
          await this.$router.push("/");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async logout() {
      try {
        const response = await users.logout();
        await this.$router.push("/");
      } catch (e) {
        console.log(e);
      }
      this.removeAuth();
      this.axios.defaults.headers.common['X-Authorization'] = null;
    },
    ...mapActions({
      removeAuth: 'removeAuth',
      setAuth: 'setAuth'
    }),
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      getAuth: 'getAuth'
    }),
  }
}
</script>

<style scoped>

</style>