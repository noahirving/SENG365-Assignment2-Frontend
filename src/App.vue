<template>
  <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="(route, index) in routes" :key="index" :index="(index).toString()" @click="$router.push(route.path)">
      {{route.name}}
    </el-menu-item>
  </el-menu>
  <router-view/>
</template>

<script>
export default {
  name: "App",
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
        }
      ]
    }
  },
  methods: {
    startHacking() {
      this.msg = "Start coding with Element Plus with 💖";
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
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
