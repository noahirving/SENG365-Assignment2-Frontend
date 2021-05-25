<template>
  <el-row :span="18">
    <el-card style="width: 90%; margin: auto; margin-bottom: 10px" >
      <el-container>
        <el-aside>
          <el-image :src="imageSrc"/>
        </el-aside>
        <el-container>
          <el-header>
            {{title}}
          </el-header>
          <el-main id="content">

            Host: {{organizer}}
            <el-container><el-image :src="organizerImageSrc"></el-image></el-container>

            Date: {{date}},
            Time: {{time}} <br>
            Attendees: {{numAcceptedAttendees}}
            <el-container>Categories: <el-tag v-for="category in event.categoryNames" :key="category">{{ category }}</el-tag></el-container>
          </el-main>
          <el-footer>
            <el-button @click="viewEvent">View</el-button>
          </el-footer>
        </el-container>
      </el-container>
    </el-card>

  </el-row>
</template>

<script>
import events from "@/api/events";
import users from "@/api/users";
export default {
  name: "EventCard",
  props: {
    event: Object,
    eventCategories: Array
  },
  data () {
    return {
      id: this.event.eventId,
      title: this.event.title,
      categories: this.event.categories,
      organizer: this.event.organizerFirstName + " " + this.event.organizerLastName,
      numAcceptedAttendees: this.event.numAcceptedAttendees,
      organizerId: "",
      organizerImageSrc: "",
      date: "",
      time: ""
    }
  },
  methods: {
    viewEvent() {
      this.$router.push(`/events/${this.id}`);
    },
    async getEvent() {
      try {
        const {status, data} = await events.getOne(this.id);
        if (status === 200) {
          this.organizerId = data.organizerId;
          this.organizerImageSrc = users.getImagePath(data.organizerId);
          const dateTime = new Date(data.date);
          this.date = dateTime.toLocaleDateString();
          this.time = dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true});
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    imageSrc() {
      return events.getImagePath(this.id);
    }
  },
  mounted() {
    this.getEvent();
  }
}
</script>


<style scoped>
#content{
  text-align: left;
}
</style>
