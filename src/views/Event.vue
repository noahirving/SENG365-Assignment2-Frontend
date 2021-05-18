<template>
  <h1>Event</h1>
  <h2 v-if="event !== null">{{event.title}}</h2>
  <p v-if="event !== null">
    Date: {{event.date}}<br>
    Categories: <el-tag type="info" v-for="category in categories" :key="category">{{category}}</el-tag><br>
    Organizer: {{event.organizerFirstName + ' ' + event.organizerLastName}}<br>
    Description: {{event.description}} <br>
    Capacity: {{ event.capacity }}<br>
    Accepted Attendees: {{event.attendeeCount}}<br>
    Attendees: <br><template v-for="attendee in attendees" :key="attendee.attendeeId">{{attendee.firstName + ' ' + attendee.lastName}}<br></template>
  </p>
  <el-image v-if="event !== null" :src="organizerImage.type + ';base64,' + organizerImage.data"></el-image>
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
      organizerImage: {
        data: null,
        type: null
      },
    }
  },
  methods: {
    async getEvent() {
      const {status, data} = await this.axios.get(`events/${this.id}`);
      if (status === 200) {
        this.event = data;
        await this.getCategories();
        await this.getAttendees();
        await this.getOrganizerImage();
      }
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
    },
    async getOrganizerImage() {
      console.log(this.event);
      const response = await this.axios.get(`users/${this.event.organizerId}/image`);
      if (response.status === 200) {
        this.organizerImage.data = response.data;
        this.organizerImage.type = response.headers["content-type"];
        console.log(this.organizerImage)
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