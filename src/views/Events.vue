<template>
<h1>Events</h1>
  <el-input placeholder="Please input" v-model="q" @keyup.enter="getEvents">
    <!--<template #prepend>
      <el-select v-model="select" placeholder="Select">
        <el-option label="Restaurant" value="1"></el-option>
        <el-option label="Order No." value="2"></el-option>
        <el-option label="Tel" value="3"></el-option>
      </el-select>
    </template>-->
    <template #prepend>
      <el-button icon="el-icon-search" @click="getEvents" />
    </template>
    <template #append>
      <el-dropdown max-height="5px" hide-on-click>
        <el-button type="primary">Category</el-button>
        <el-dropdown-item v-for="category in categories" :key="category.id">

          <el-checkbox v-model="categoryId" :value="category.id">{{category.name}}</el-checkbox>
        </el-dropdown-item>
      </el-dropdown>
    </template>
  </el-input>
  <ol>
    <li v-for="event in events" :key="event.id">
      {{event.title}}
    </li>
  </ol>

</template>

<script>
export default {
  name: "Events",
  data() {
    return {
      events: [],
      categories: [],
      q: "",
      categoryId: []
    }
  },
  methods: {
    async getEvents() {
      const params = {};
      if (this.q !== "") params.q = this.q;
      const {status, data} = await this.axios.get("events",
          { params: params});
      if (status === 200) {
        this.events = data;
      }
    },
    async getCategories() {
      const {status, data} = await this.axios.get("events/categories");
      if (status === 200) {
        this.categories = data;
        /*this.categoryId = {};
        for (const category in this.categories){
          this.categoryId.category.id = false;
        }*/
      }
    }
  },
  mounted() {
    //this.getEvents();
    this.getCategories()
  }
}
</script>

<style scoped>

</style>