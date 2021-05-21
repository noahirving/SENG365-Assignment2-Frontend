<template>
  <el-menu :default-active="activeIndex" mode="horizontal">
    <el-menu-item v-for="(route, index) in routes"
                  :key="index"
                  :index="(index).toString()"
                  @click="$router.push(route.path)">
      {{route.name}}
    </el-menu-item>
    <el-menu-item>
      <Logout/>
    </el-menu-item>
  </el-menu>
</template>

<script>
import Logout from "@/components/Logout";
export default {
  name: "App",
  components: {Logout},
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
        {
          path: "/users/register",
          name: "Register"
        },
        {
          path: "/users/login",
          name: "Login"
        }
      ]
    }
  },
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
