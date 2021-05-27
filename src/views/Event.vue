<template>
  <el-row v-if="event != null && event.title != null">
    <el-col :span="16" :offset="4">
      <el-container>
        <el-divider/>
        <el-header>
          <h1>{{event.title}}
            <DeleteEvent v-if="isEventOwner" :id="id"/>
          </h1>
        </el-header>
        <el-divider/>
        <el-container>
          <el-aside style="width: 600px">
            <el-image :src="image.src"
                      style="width: 600px; height: 600px"
                      fit="cover">
              <template #error>
                <i class="el-icon-picture-outline"></i>
              </template>
            </el-image>
          </el-aside>
          <el-main>
            <el-descriptions direction="vertical" :column="1">
              <el-descriptions-item label="Date and time:">{{dateTime}}</el-descriptions-item>
              <el-descriptions-item label="Categories:"><el-tag v-for="category in event.categoryNames" :key="category">{{ category }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="Organizer:">
                {{event.organizerFirstName + ' ' + event.organizerLastName}}<br>
                <el-image :src="organizerImage"
                          style="width: 100px; height: 100px"
                          fit="cover">
                  <template #error>
                    <i class="el-icon-picture-outline"></i>
                  </template>
                </el-image>
              </el-descriptions-item>
              <el-descriptions-item label="Description:">{{event.description}}</el-descriptions-item>
              <el-descriptions-item label="Capacity:">{{event.capacity}}</el-descriptions-item>
              <el-descriptions-item label="Accepted Attendees:">{{event.attendeeCount}}</el-descriptions-item>
            </el-descriptions>
          </el-main>
        </el-container>
      </el-container>
    </el-col>
  </el-row>


  <Attendees :event-id="id" :organizer="isEventOwner" v-on:updated="getEvent"/>
  <el-row>
    <el-container>
      <el-header>
        <h2>Similar events:</h2>
      </el-header>
      <el-divider/>
      <EventCard v-for="otherEvent in similarEvents" :key="otherEvent.eventId" :event="otherEvent"/>
    </el-container>
  </el-row>
</template>

<script>
import EventCard from "@/components/EventCard";
import events from "@/api/events";
import users from "@/api/users"
import DeleteEvent from "@/components/DeleteEvent";
import {mapState} from "vuex";
import Attendees from "@/components/Attendees";
export default {
  name: "Event",
  components: {Attendees, DeleteEvent, EventCard},
  data() {
    return {
      event: null,
      dateTime: "",
      categories: [],
      attendees: [],
      image: {
        src: "",
        file: null,
      },
      organizerImage: null,
      organizerId: null,
      similarEvents: []
    }
  },
  methods: {
    async getEvent() {
      try {
        const {data} = await events.get(this.id);
        this.event = data;
        const dateTime = new Date(this.event.date);
        this.dateTime = dateTime.toLocaleDateString() + ', ' + dateTime.toLocaleTimeString();
        this.image.src = events.getImagePath(this.id);
        this.organizerId = this.event.organizerId;
        this.organizerImage = users.getImagePath(this.organizerId);

      } catch (e) {
        console.error(e);
      }
    },
    async getSimilarEvents() {
      const {status, data} = await events.getAll({categoryIds: this.event.categories});

      try {
        if (status === 200) {
          // Removes itself from similar
          for (let i = 0; i < data.length; i++) {
            if (data[i].eventId == this.id) {
              data.splice(i, 1);
              break;
            }
          }
          this.similarEvents = data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async setup() {
      await this.getEvent();
      await this.getSimilarEvents();

    }
  },
  computed: {
    id() {
      return parseInt(this.$route.params.id);
    },
    ...mapState({
      userId: 'userId'
    }),
    isEventOwner() {
      return this.userId === this.organizerId;
    }
  },
  watch: {
    id() {
      this.getEvent();
    }
  },
  mounted() {
    this.setup();
  }
}
</script>

<style scoped>

</style>