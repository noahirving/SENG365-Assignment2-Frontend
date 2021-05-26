<template>
  <div id="app">
    <child v-for="n in 20" :key="n"/>
  </div>
</template>

<script>
import Child from "@/views/child";
export default {
  name: "test",
  components: {Child}
}
</script>

<style scoped>

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

</style>