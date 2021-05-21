<template>
  <h1>Event</h1>
  <h2 v-if="event !== null">{{event.title}}</h2>
  <p v-if="event !== null">
    Date and Time: {{event.date}}<br>
    Categories: <el-tag type="info" v-for="category in categories" :key="category">{{category}}</el-tag><br>
    Organizer: {{event.organizerFirstName + ' ' + event.organizerLastName}}<br>
    Description: {{event.description}} <br>
    Capacity: {{ event.capacity }}<br>
    Accepted Attendees: {{event.attendeeCount}}<br>
    Attendees: <br><template v-for="attendee in attendees" :key="attendee.attendeeId">{{attendee.firstName + ' ' + attendee.lastName}}<br></template>
    Similar Events: <template v-for="otherEvent in similarEvents">{{otherEvent.title}}, </template>
  </p>
  <el-image v-if="organizerImage !== null" :src="organizerImage">
    <template #error>
      <div class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>

    </template>
  </el-image>
</template>

<script>
export default {
  name: "Event",
  data() {
    return {
      id: this.$route.params.id,
      event: null,
      categories: [],
      attendees: [],
      organizerImage: null,
      similarEvents: []
    }
  },
  methods: {
    async getEvent() {
      const {status, data} = await this.axios.get(`events/${this.id}`);
      if (status === 200) {
        this.event = data;
        await this.getCategories();
        await this.getAttendees();
        this.organizerImage = (this.axios.defaults.baseURL + `events/${this.event.organizerId}/image`);

        console.log(this.organizerImage)
        await this.getSimilarEvents();
      }
    },
    async getSimilarEvents() {
      const {status, data} = await this.axios.get("events",{params:{categoryIds: this.event.categoryIds}});
      if (status === 200) {
        this.similarEvents = data;
      }
      return this.events;
    },
    async getCategories() {
      const {status, data} = await this.axios.get("events/categories");
      if (status === 200) {
        this.categories = [];
        for (const {id, name} of data){
          if (id in this.event.categories) {
            this.categories.push(name);
          }
        }
      }
    },
    async getAttendees() {
      const {status, data} = await this.axios.get(`events/${this.id}/attendees`);
      if (status === 200) {
        this.attendees = data;
      }
    }
  },
  mounted() {
    this.getEvent();
  }
}
</script>

<style scoped>

</style>