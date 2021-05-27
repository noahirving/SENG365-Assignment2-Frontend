<template v-if="user">
  <el-row>
    <el-col :span="16" :offset="4">
      <el-container>
        <el-header>
          <h2>Profile</h2>
          <el-divider/>
        </el-header>
        <el-container>
        <el-aside style="width: 600px; height: 600px">
          <el-image ref="image" :src="image" :key="imageKey" style="width: 100%; height: 90%" fit="cover">
            <template #error>
              <i class="el-icon-user" style="font-size: 600px"/>
            </template>
          </el-image>
        </el-aside>
        <el-main>
          <el-descriptions direction="vertical" :column="1">
            <el-descriptions-item>
              <EditUser :user="user" v-on:edited="edited"/>
            </el-descriptions-item>
            <el-descriptions-item label="First name:">{{firstName}}</el-descriptions-item>
            <el-descriptions-item label="Last name:">{{lastName}}</el-descriptions-item>
            <el-descriptions-item label="Email:">{{email}}</el-descriptions-item>
          </el-descriptions>
        </el-main>
        </el-container>
      </el-container>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-divider/>
      <MyEvents :user-id="userId"/>
    </el-col>
  </el-row>


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