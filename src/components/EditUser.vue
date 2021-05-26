<template>
  <el-button
      type="primary"
      @click="visible = true">
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

      <el-form-item label="Profile Image:">
        <ImageUploader v-on:image="setNewImage"/>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" @click="updateUser()">Save</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import ImageUploader from "@/components/ImageUploader";
import users from "@/api/users";
import mapState from "vuex";

export default {
  name: "EditUser",
  components: {ImageUploader},
  props: {
    user: Object,
  },
  data() {
    return {
      visible: false,

      firstName: "",
      lastName: "",
      email: "",
      image: {
        file: "",
        src: ""
      },
    }
  },
  methods: {

    async updateUser() {
      try {
        const {status} = await users.edit(this.userId, this.firstName, this.lastName, this.email);
        if (status !== 200) return;

        if (this.image !== {}) {
          const {status} = await users.editImage(this.userId, this.image.file);
          console.log('image status:', status);
        }
        this.visible = false;
      } catch (e) {
        console.error(e);
      }
    },
    setNewImage(image) {
      this.image = image;
    },
  },
  computed: {
    ...mapState(['userId'])
  }
}
</script>

<style scoped>

</style>