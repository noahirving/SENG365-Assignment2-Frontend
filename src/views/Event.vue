<template>
  <h1>Event</h1>
  <h2 v-if="event !== null">{{event.title}}</h2> <DeleteEvent v-if="isEventOwner" :id="id"/>
  <p v-if="event !== null">
    Date and Time: {{event.date}}<br>
    Categories: <el-tag v-for="category in event.categoryNames" :key="category">{{ category }}</el-tag><br>
    Organizer: {{event.organizerFirstName + ' ' + event.organizerLastName}}<br>
  </p>
  <el-image v-if="organizerImage !== null" :src="organizerImage">
    <template #error>
      <div class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>

    </template>
  </el-image>
  <p v-if="event !== null">
    Description: {{event.description}} <br>
    Capacity: {{ event.capacity }}<br>
    Accepted Attendees: {{event.attendeeCount}}<br>
    Attendees: <br><template v-for="attendee in attendees" :key="attendee.attendeeId">{{attendee.firstName + ' ' + attendee.lastName}}<br></template>
    Similar Events: <template v-for="otherEvent in similarEvents">{{otherEvent.title}}, </template>
  </p>
  Similar Events:
  <EventCard v-for="otherEvent in similarEvents" :key="otherEvent.eventId" :event="otherEvent"/>
</template>

<script>
import EventCard from "@/components/EventCard";
import events from "@/api/events";
import users from "@/api/users"
import DeleteEvent from "@/components/DeleteEvent";
import {mapState} from "vuex";
export default {
  name: "Event",
  components: {DeleteEvent, EventCard},
  data() {
    return {
      event: null,
      categories: [],
      attendees: [],
      organizerImage: null,
      organizerId: null,
      similarEvents: []
    }
  },
  methods: {
    async getEvent() {
      try {
        const {status, data} = await events.get(this.id);
        console.log(status, data);
        if (status === 200) {
          this.event = data;
          await this.getAttendees();
          this.organizerId = this.event.organizerId;
          this.organizerImage = users.getImagePath(this.organizerId);

          console.log(this.organizerImage)
          await this.getSimilarEvents();
        }
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
    async getAttendees() {
      const {status, data} = await this.axios.get(`events/${this.id}/attendees`);
      if (status === 200) {
        this.attendees = data;
      }
    },
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
    this.getEvent();
  }
}
</script>

<style scoped>

</style>