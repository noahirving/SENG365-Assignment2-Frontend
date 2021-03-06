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
    <el-container>

    <el-form :model="loginForm">
      <el-form-item label="Email">
        <el-input v-model="loginForm.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off"/>
      </el-form-item>
    </el-form>

    </el-container>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="hide">Cancel</el-button>
      <el-button type="primary" @click="login()">Login</el-button>
    </span>
    </template>
  </el-dialog>

  <!-- Register dialog -->
  <el-dialog
      title="Register"
      v-model="registerVisible">

    <el-container>
    <el-form :model="registerForm">
      <el-form-item label="First Name">
        <el-input v-model="registerForm.firstName"/>
      </el-form-item>
      <el-form-item label="Last Name">
        <el-input v-model="registerForm.lastName"/>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="registerForm.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="registerForm.password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Profile image">
        <image-uploader v-on:image="setImage" :key="imageKey"/>
      </el-form-item>
    </el-form>
    </el-container>

    <template #footer>
    <span class="dialog-footer">
      <el-button @click="hide">Cancel</el-button>
      <el-button type="primary" @click="register()">Register</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex/dist/vuex.mjs";
import users from "@/api/users";
import ImageUploader from "@/components/ImageUploader";

export default {
  name: "Login",
  components: {ImageUploader},
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

      image: {
        file: null,
        src: ""
      },

      imageKey: 0
    }
  },
  methods: {
    setImage(image) {
      this.image = image;
    },
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
          if (this.image.file !== null) {
            await users.editImage(response.data.userId, this.image.file);
          }
        }
        console.log(response);
      } catch (e) {
        console.log(e);
        this.$message.error(e.response.statusText);
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
          this.clearForms();
        }
      } catch (e) {
        console.error(e);
        this.$message.error(e.response.statusText);
      }
    },
    clearForms() {

      this.imageKey++;
      this.loginForm = {
        email: "",
        password: ""
      };
      this.registerForm = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      };

    },
    hide() {
      this.clearForms();
      this.loginVisible = false;
      this.registerVisible = false;
    },
    async logout() {
      try {
        const response = await users.logout();
        await this.$router.push("/");
      } catch (e) {
        console.log(e);
        this.$message.error(e.response.statusText);
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