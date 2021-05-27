<template :key="pageKey">
  <el-row v-if="event != null && event.title != null">
    <el-col :span="16" :offset="4">
      <el-container>
        <el-divider/>
        <el-header>
          <h1>{{event.title}}
            <template v-if="isEventOwner">
              <EditEvent :event="event" :current-image="image" v-on:updated="edited" />
              <DeleteEvent v-if="isEventOwner" :id="id"/>
            </template>
          </h1>
        </el-header>
        <el-divider/>
        <el-container>
          <el-aside style="width: 600px">
            <el-image :src="image.src"
                      style="width: 600px; height: 600px"
                      fit="cover">
              <template #error>
                <i class="el-icon-picture-outline" style="font-size: 600px"/>
              </template>
            </el-image>
          </el-aside>
          <el-main>
            <el-descriptions direction="vertical" :column="1">
              <el-descriptions-item v-if="isLoggedIn">
                <Attend :event-id="id" v-on:updated="attendanceUpdated"/>
              </el-descriptions-item>
              <el-descriptions-item label="Date and time:">{{dateTime}}</el-descriptions-item>
              <el-descriptions-item label="Categories:"><el-tag v-for="category in event.categoryNames" :key="category">{{ category }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="Organizer:">
                {{event.organizerFirstName + ' ' + event.organizerLastName}}<br>
                <el-image :src="organizerImage"
                          style="width: 100px; height: 100px"
                          fit="cover">
                  <template #error>
                    <i class="el-icon-user" style="font-size: 100px"/>
                  </template>
                </el-image>
              </el-descriptions-item>
              <el-descriptions-item label="Description:">{{event.description}}</el-descriptions-item>
              <el-descriptions-item label="Capacity:">{{event.capacity}}</el-descriptions-item>
              <el-descriptions-item label="Accepted Attendees:">{{event.attendeeCount}}</el-descriptions-item>
              <el-descriptions-item v-if="event.isOnline" label="URL:"><a :href="event.url">{{event.url}}</a></el-descriptions-item>
              <el-descriptions-item v-else label="Venue:">{{event.venue}}</el-descriptions-item>
              <el-descriptions-item label="Fee:">${{event.fee}}</el-descriptions-item>
            </el-descriptions>
          </el-main>
        </el-container>
      </el-container>
    </el-col>
  </el-row>


  <Attendees :event-id="id" :organizer="isEventOwner" :organizer-id="organizerId" v-on:updated="getEvent" :key="attendeesKey"/>
  <el-row>
    <el-container>
      <el-header>
        <h2>Similar events:</h2>
      </el-header>
      <el-divider/>
      <EventCard v-for="otherEvent in similarEvents" :key="otherEvent.eventId" :event="otherEvent" v-on:viewed="viewedEvent"/>
    </el-container>
  </el-row>
</template>

<script>
import EventCard from "@/components/EventCard";
import events from "@/api/events";
import users from "@/api/users"
import DeleteEvent from "@/components/DeleteEvent";
import {mapGetters, mapState} from "vuex";
import Attendees from "@/components/Attendees";
import EditEvent from "@/components/EditEvent"
import Attend from "@/components/Attend";
export default {
  name: "Event",
  components: {Attend, Attendees, DeleteEvent, EventCard, EditEvent},
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
      similarEvents: [],

      attendeesKey: 0,
      pageKey: 0
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
    async edited() {
      this.image.src = "";
      await this.getEvent();
    },
    attendanceUpdated() {
      this.attendeesKey += 1;
    },
    async viewedEvent() {
      await this.setup()
      this.pageKey++;
      window.scrollTo(0, 0);

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
    ...mapGetters(['isLoggedIn']),
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