<template>

  <el-card class="box-card">
    <template #header>
      <el-header>Register</el-header>
    </template>
    <el-form>
      <el-form-item label="First Name">
        <el-input v-model="firstName" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Last Name">
        <el-input v-model="lastName" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="register">Register</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  },
  methods: {
    async register() {
      console.log(this.$router.getRoutes());
      const response = await this.axios.post('users/register', {
        "firstName": this.firstName,
        "lastName": this.lastName,
        "email": this.email,
        "password": this.email
      });

      console.log(response)
    }
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