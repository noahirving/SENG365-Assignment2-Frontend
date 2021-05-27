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
    <el-tabs v-model="tab">
      <el-tab-pane label="User">
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
        </el-form>
      </el-tab-pane>

      <!-- Image -->
      <el-tab-pane label="Image">
        <el-form>
          <el-form-item label="Profile Image:">
            <ImageUploader v-on:image="setNewImage" :current-image-src="image.src"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- Buttons -->
    <template #footer>
    <span class="dialog-footer">
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
      tab: "0",
      visible: false,

      firstName: "",
      lastName: "",
      email: "",
      image: {
        file: null,
        src: ""
      },

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
        if (this.tab === "0") {
          await users.edit(this.userId, this.getBody());
        }
        else {
          await this.updateImage();
        }
        this.close();
        this.$message.success('Updated');
        this.$emit('edited');
      } catch (e) {
        console.error(e);
        this.$message.error(e.response.statusText);
      }
    },
    async updateImage() {
      console.log('image')
      if (this.image.file !== null) {
        await users.editImage(this.userId, this.image.file);
      } else {

        let imageExists = true;
        try {
          await users.getImage(this.userId);
        } catch (e) {
          imageExists = false;
        }
        if (imageExists) {
          await users.deleteImage(this.userId)
        }
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
      this.image.src = users.getImagePath(this.userId);
    },
    close() {
      this.image.src = "";
      this.visible = false;
      this.changePassword = false;
    }
  },
  computed: {
    ...mapState(['userId']),
    currentImage() {
      return users.getImagePath(this.userId);
    }
  },
}
</script>

<style scoped>

</style>