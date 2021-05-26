<template>
  <el-card v-if="isLoggedIn">
    <EditUser/>
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


</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";
import EditUser from "@/components/EditUser";

export default {
  name: "Profile",
  components: {EditUser},
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      image: ""
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