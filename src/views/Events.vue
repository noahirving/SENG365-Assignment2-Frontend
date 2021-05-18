<template>
  <h1>Events</h1>
  <el-row type="flex" justify="center">
    <!-- Search bar -->
    <el-col :span="12">
      <el-input placeholder="Please input" v-model="q" @keyup.enter="getEvents">
      <template #prepend>
        <el-button icon="el-icon-search" @click="getEvents" />
      </template>
      </el-input>
    </el-col>

    <!-- Categories -->
    <el-col :span="3">
      <el-dropdown :hide-on-click="false" :max-height="300">
        <el-button type="primary">
          Categories<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(category, index) in categories" :key="index">
              <el-checkbox v-model="category.active" >
                {{category.name}}
              </el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>

    <!-- Sort by -->
    <el-col :span="3">
      <el-select v-model="sortBy" placeholder="Sort by" >
        <el-option v-for="sort in sortings" :key="sort.key" :label="sort.name" :value="sort.key"></el-option>
      </el-select>
    </el-col>
  </el-row>


  <!-- Results -->
  <el-table
      :data="events"
      stripe
      style="width: 100%">
    <el-table-column
        prop="title"
        label="Title"/>
    <el-table-column
      label="Organizer">
      <template #default="props">
        {{props.row.organizerFirstName + " " + props.row.organizerLastName}}
      </template>
    </el-table-column>
    <el-table-column
      prop="numAcceptedAttendees"
      label="Attendees"/>
    <el-table-column>
      <template #default="props">
        <el-button type="text" @click="viewEvent(props.row.eventId)">View</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Pagination -->
  <el-pagination
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="50"
      @current-change="(val) => pageNumber = val"
  />


</template>

<script>
export default {
  name: "Events",
  data() {
    return {
      events: [],
      categories: [],
      sortings: [
        {
          name: "A-Z",
          key: "ALPHABETICAL_ASC"
        },
        {
          name: "Z-A",
          key: "ALPHABETICAL_DESC"
        },
        {
          name: "Earliest date",
          key: "DATE_ASC"
        },
        {
          name: "Latest date",
          key: "DATE_DESC"
        },
        {
          name: "Most Attendees",
          key: "ATTENDEES_DESC"
        },
        {
          name: "Least Attendees",
          key: "ATTENDEES_ASC"
        },
        {
          name: "Most Capacity",
          key: "CAPACITY_ASC"
        },
        {
          name: "Least Capacity",
          key: "CAPACITY_DESC"
        },
      ],
      q: "",
      sortBy: null,
      pageNumber: 1,
      pageSize: 10
    }
  },
  methods: {
    async getEvents() {
      const {status, data} = await this.axios.get("events",{ params: this.getParams()});
      if (status === 200) {
        this.events = data;
      }
      return this.events;
    },
    getParams() {
      const params = {};
      if (this.q !== "") params.q = this.q;

      let categoryIds = [];
      for (const {id, active} of this.categories){
        if (active) categoryIds.push(id);
      }
      if (categoryIds.length > 0) params.categoryIds = categoryIds;

      if (this.sortBy !== null) params.sortBy = this.sortBy;
      return params;
    },
    async getCategories() {
      const {status, data} = await this.axios.get("events/categories");
      if (status === 200) {
        this.categories = [];
        for (const {id, name} of data){
          this.categories.push({
            id: id,
            name: name,
            active: false
          })
        }
      }
    },
    viewEvent(id) {
      this.$router.push(`/events/${id}`);
    },
  },
  mounted() {
    this.getEvents();
    this.getCategories()
  }
}
</script>

<style scoped>

</style>