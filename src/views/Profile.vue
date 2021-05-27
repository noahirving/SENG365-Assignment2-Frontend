<template>
  <el-card v-if="isLoggedIn">
    <EditUser :user="user" v-on:edited="edited"/>
    {{firstName}}
    {{lastName}}
    {{email}}
    <el-image ref="image" :src="image" :key="imageKey">
      <template #error>
        <div class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>

      </template>
    </el-image>

    <MyEvents :user-id="userId"/>
  </el-card>


</template>

<script>
import {mapGetters} from "vuex";
import EditUser from "@/components/EditUser";
import users from '@/api/users';
import MyEvents from "@/components/MyEvents";

export default {
  name: "Profile",
  components: {MyEvents, EditUser},
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      image: "",
      imageKey: 0
    }
  },
  methods: {
    async edited() {
      try {
        this.image = "";
        await this.getUser();
      } catch (e) {
        console.error(e);
      }
    },
    async getUser() {
      const {status, data} = await users.get(this.userId);
      if (status === 200) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.image = users.getImagePath(this.userId);
      }
    }
  },
  computed: {
    ...mapGetters( {
      userId: 'getUserId',
      isLoggedIn: 'isLoggedIn'
    }),
    user() {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getUser();
    }
    else this.$router.push('/');
  }
}
</script>

<style scoped>

</style>