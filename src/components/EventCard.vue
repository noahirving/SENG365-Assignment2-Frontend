<template>
  <el-row :span="18">
    <el-card style="width: 90%; margin: auto; margin-bottom: 10px" >
      <el-container>
        <el-aside>
          <el-image :src="imageSrc" style="width: 300px; height: 300px;" fit="cover">
            <template #error>
              <i class="el-icon-picture-outline" style="font-size: 300px"/>
            </template>
          </el-image>
        </el-aside>
        <el-container>
          <el-header>
            <h2>{{title}}</h2>
          </el-header>
          <el-main id="content">
            <el-container>
              <el-aside width="60%">
                Date: {{date}},
                Time: {{time}} <br>
                Attendees: {{numAcceptedAttendees}}
                <el-container>Categories: <el-tag v-for="category in event.categoryNames" :key="category">{{ category }}</el-tag></el-container>

              </el-aside>
              <el-main>

                Host: {{organizer}} <br>
                <el-image :src="organizerImageSrc"
                          style="width: 100px; height: 100px"
                          fit="cover">
                  <template #error>
                    <i class="el-icon-user" style="font-size: 100px"/>
                  </template>
                </el-image>
              </el-main>
            </el-container>

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
  emits: ['viewed'],
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
    async viewEvent() {
      console.log(`/events/${this.id}`)
      await this.$router.push(`/events/${this.id}`);
      this.$emit('viewed');
    },
    async getEvent() {
      try {
        const {status, data} = await events.get(this.id);
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
