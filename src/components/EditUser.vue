<template>
  <el-button
      type="primary"
      @click="open">
    Edit User
  </el-button>
  <!-- Edit Profile Dialog -->
  <el-dialog
      title="Edit Profile"
      v-model="visible">
    <el-form>
      <el-form-item label="First Name:">
        <el-input v-model="firstName"/>
      </el-form-item>
      <el-form-item label="Last Name:">
        <el-input v-model="lastName"/>
      </el-form-item>
      <el-form-item label="Email:">
        <el-input v-model="email" autocomplete="off"/>
      </el-form-item>

      <!-- Password -->
      <el-checkbox v-model="changePassword">Change Password</el-checkbox>
      <template v-if="changePassword">
        <el-form-item label="Current password:">
          <el-input type="password" v-model="currentPassword" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="new password:">
        <el-input type="password" v-model="password" autocomplete="off"/>
      </el-form-item>
      </template>

      <!-- Image -->
      <el-form-item label="Profile Image:">
        <ImageUploader v-on:image="setNewImage"/>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="danger" @click="deleteImage">Delete Image</el-button>
      <el-button @click="close">Cancel</el-button>
      <el-button type="primary" @click="updateUser">Save</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import ImageUploader from "@/components/ImageUploader";
import users from "@/api/users";
import {mapState} from "vuex";

export default {
  name: "EditUser",
  components: {ImageUploader},
  emits: ['edited'],
  props: {
    user: Object,
  },
  data() {
    return {
      visible: false,

      firstName: "",
      lastName: "",
      email: "",
      image: {},

      changePassword: false,
      currentPassword: "",
      password: ""
    }
  },
  methods: {
    getBody() {
      const body = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      }

      if (this.changePassword){
        body.password = this.password;
        body.currentPassword = this.currentPassword;
      }
      return body;
    },
    async updateUser() {
      try {
        const {status} = await users.edit(this.userId, this.getBody());
        if (status !== 200) return;
        if (Object.keys(this.image).length !== 0) {
          const {status} = await users.editImage(this.userId, this.image.file);
        }
        this.close();
        this.$emit('edited');
      } catch (e) {
        console.error(e);
        this.$message.error(e.response.statusText);
      }
    },
    setNewImage(image) {
      this.image = image;
    },
    open() {
      this.visible = true;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.email = this.user.email;
    },
    close() {
      this.visible = false;
      this.changePassword = false;
    },
    async deleteImage() {
      try {
        await users.deleteImage(this.userId);
        this.$emit('edited');
        this.close();
      } catch (e) {
        console.error(e);
        this.$message.error(e.response.statusText);
      }
    }
  },
  computed: {
    ...mapState(['userId']),
  }
}
</script>

<style scoped>

</style>