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
            <el-dropdown-item v-for="(category, id) in categories" :key="id">
              <el-checkbox v-model="activeCategories[id]">
                {{category}}
              </el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>

    <!-- Sort by -->
    <el-col :span="3">
      <el-select v-model="sortBy" placeholder="Sort by" @change="getEvents">
        <el-option v-for="sort in sortings" :key="sort.key" :label="sort.name" :value="sort.key"></el-option>
      </el-select>
    </el-col>
  </el-row>


  Showing {{pageStartIndex + 1}}-{{Math.min(pageEndIndex, events.length)}} of {{totalEvents}}
  <EventCard v-for="event in eventsPage"
             :key="event.eventId"
             :event="event"/>

  <!-- Pagination -->
  <el-pagination
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="events.length"
      @current-change="(val) => pageNumber = val"
  />


</template>

<script>
import EventCard from "@/components/EventCard";
import events from "@/api/events";
export default {
  name: "Events",
  components: {EventCard},
  data() {
    return {
      events: [],
      eventsPage: [],
      categories: {},
      activeCategories: {},
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
      pageSize: 10,
      totalEvents: 0
    }
  },
  methods: {
    async getEvents() {

      const {status, data} = await this.axios.get("events",{ params: this.getParams()});
      if (status === 200) {
        this.events = data;
        for (const event of this.events) {
          event.categoryNames = event.categories.map(id => this.categories[id]);
        }
        this.totalEvents = this.events.length;
        //this.pageNumber = 1;
        this.updatePage();
      }
    },
    updatePage() {
      window.scrollTo(0, 0);
      this.eventsPage = JSON.parse(JSON.stringify(this.events)).splice(this.pageStartIndex, this.pageEndIndex);

    },
    getParams() {
      const params = {};
      if (this.q !== "") params.q = this.q;

      let categoryIds = [];
      for (const id in this.activeCategories){
        if (this.activeCategories[id]) categoryIds.push(id);
      }
      if (categoryIds.length > 0) params.categoryIds = categoryIds;

      if (this.sortBy !== null) params.sortBy = this.sortBy;
      return params;
    },
    async getCategories() {
      try {
        const {status, data} = await events.getCategories();
        this.categories = data;
        this.activeCategories = {};
        for (const id in this.categories){
          this.activeCategories[id] = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  watch: {
    sortBy: function(){
      this.getEvents()
    },
    pageNumber: function() {
      this.updatePage();
    }

  },
  computed: {
    pageStartIndex() {
      return (this.pageNumber - 1) * this.pageSize;
    },
    pageEndIndex() {
      return this.pageNumber * this.pageSize;
    }
  },
  mounted() {
    this.getCategories();
    this.getEvents();
  }
}
</script>

<style scoped>

</style>