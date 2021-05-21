<template>
  <el-menu :default-active="activeIndex" mode="horizontal">
    <el-menu-item v-for="(route, index) in routes"
                  :key="index"
                  :index="(index).toString()"
                  @click="$router.push(route.path)">
      {{route.name}}
    </el-menu-item>
    <el-menu-item v-if="isLoggedIn"
                  :index="this.routes.length.toString()"
                  @click="$router.push('/profile')">Profile</el-menu-item>
    <el-menu-item>
      <Login/>
    </el-menu-item>
  </el-menu>
</template>

<script>
import Login from "@/components/Login";
import {mapActions} from "vuex";
import {mapGetters} from "vuex/dist/vuex.mjs";
export default {
  name: "App",
  components: {Login},
  data() {
    return {
      activeIndex: "0",
      routes: [
        {
          path:"/",
          name: "Home"
        },
        {
          path: "/events",
          name: "Events"
        },
      ]
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn'
    }),
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
