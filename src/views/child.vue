<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="6"><div class="grid-content bg-purple">Hello</div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light">Hi</div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div>Bye</el-col>
  </el-row>
</template>

<script>
export default {
  name: "child"
}
</script>

<style scoped>
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
</style>