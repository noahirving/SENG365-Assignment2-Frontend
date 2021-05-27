<template>
  <el-row type="flex" justify="center">
    <el-col :span="12">
      <h1>Events</h1>
    </el-col>
    <el-col :span="4">
      <CreateEvent v-if="isLoggedIn" v-on:created="getEvents()"/>
    </el-col>
  </el-row>
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
      <CategorySelector v-on:updated="updateSelectedCategoryIds"/>
    </el-col>

    <!-- Sort by -->
    <el-col :span="3">
      <el-select v-model="sortBy" placeholder="Sort by" @change="getEvents">
        <el-option v-for="sort in sortings" :key="sort.key" :label="sort.name" :value="sort.key"></el-option>
      </el-select>
    </el-col>
  </el-row>


  Showing {{Math.min(pageStartIndex + 1, events.length)}}-{{Math.min(pageEndIndex, events.length)}} of {{totalEvents}}
  <EventCard v-for="event in eventsPage"
             :key="event.eventId"
             :event="event"/>

  <!-- Pagination -->
  <el-pagination
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="events.length"
      @current-change="pageChange"
  />


</template>

<script>
import EventCard from "@/components/EventCard";
import events from "@/api/events";
import CreateEvent from "@/components/CreateEvent";
import {mapGetters} from "vuex";
import CategorySelector from "@/components/CategorySelector";
export default {
  name: "Events",
  components: {CategorySelector, CreateEvent, EventCard},
  data() {
    return {
      events: [],
      eventsPage: [],
      selectedCategoryIds: [],
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
      pageStartIndex: 0,
      pageEndIndex: 0,
      totalEvents: 0
    }
  },
  methods: {
    updateSelectedCategoryIds(ids) {
      this.selectedCategoryIds = ids;
      this.getEvents()
    },
    async getEvents() {
      const {status, data} = await events.getAll(this.getParams());
      if (status === 200) {
        this.events = data;
        this.totalEvents = this.events.length;
        this.updatePage();
      }
    },
    pageChange(val) {
      this.pageNumber = val;
      this.updatePage();
    },
    updatePage() {
      window.scrollTo(0, 0);
      this.pageStartIndex = (this.pageNumber - 1) * this.pageSize;
      this.pageEndIndex = this.pageNumber * this.pageSize;
      console.log(this.pageStartIndex, this.pageEndIndex)
      this.eventsPage = JSON.parse(JSON.stringify(this.events)).slice(this.pageStartIndex, this.pageEndIndex);
      console.log(this.eventsPage)
    },
    getParams() {
      const params = {};
      if (this.q !== "") params.q = this.q;

      if (this.selectedCategoryIds.length > 0) params.categoryIds = this.selectedCategoryIds;

      if (this.sortBy !== null) params.sortBy = this.sortBy;
      return params;
    }
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
    ...mapGetters(['isLoggedIn'])
  },
  mounted() {
    this.getEvents();
  }
}
</script>

<style scoped>

</style>