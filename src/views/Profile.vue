<template>
<el-card v-if="isLoggedIn">
  <el-button
      type="primary"
      @click="editUserVisible = true">
    Edit User
  </el-button>
  {{firstName}}
  {{lastName}}
  {{email}}
  <el-image :src="image">
    <template #error>
      <div class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>

    </template>
  </el-image>
</el-card>

  <!-- Edit Profile Dialog -->
  <el-dialog
      title="Edit Profile"
      v-model="editUserVisible">
    <el-form>
      <el-form-item label="First Name" :maxlength="labelWidth">
        <el-input v-model="firstName" :maxlength="inputWidth"/>
      </el-form-item>
      <el-form-item label="Last Name" :maxlength="labelWidth">
        <el-input v-model="lastName" :maxlength="inputWidth"/>
      </el-form-item>
      <el-form-item label="Email" :maxlength="labelWidth">
        <el-input v-model="email" autocomplete="off" :maxlength="inputWidth"/>
      </el-form-item>
      <el-form-item label="Profile Image" :maxlength="labelWidth">
        <el-input type="file" v-model="newImage" autocomplete="off" :maxlength="inputWidth"/>
      </el-form-item>

    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="editUserVisible = false">Cancel</el-button>
      <el-button type="primary" @click="updateUser()">Save</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      image: "",
      newImage: "",
      editUserVisible: false,
      labelWidth: "120px",
      inputWidth: "260px"
    }
  },
  methods: {
    async getUser() {
      const {status, data} = await this.axios.get(`users/${this.userId}`);
      if (status === 200) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.image = (this.axios.defaults.baseURL + `users/${this.userId}/image`);
      }
    },
    async updateUser() {
      const body = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
      };
      const {status} = await this.axios.patch(`users/${this.userId}`, body);
      if (status === 200) {
        this.editUserVisible = false;
        await this.getUser();
      }
    }

  },
  computed: {
    ...mapGetters( {
      userId: 'getUserId',
      isLoggedIn: 'isLoggedIn'
    })
  },
  mounted() {
    if (this.isLoggedIn) this.getUser();
  }
}
</script>

<style scoped>

</style>