<template>
  <el-button v-if="isAttending" type="danger" @click="removeAttendance">Remove attendance</el-button>
  <el-button v-else type="success" @click="attend">Attend</el-button>
</template>

<script>
import {mapState} from "vuex";
import attendees from "@/api/attendees";

export default {
  name: "Attend",
  props: {
    eventId: Number
  },
  emits: ['updated'],
  data() {
    return {
      isAttending: false,
    }
  },
  methods: {
    async attend() {
      try {
        await attendees.create(this.eventId);
        await this.getAttendance();
        this.$message.success("Attending event");
        this.$emit('updated');
      } catch (e) {
        console.log(e)
        this.$message.error(e.response.statusText);
      }
    },
    async removeAttendance() {
      try {
        await attendees.delete(this.eventId);
        await this.getAttendance();
        this.$message.success("Removed attendance");
        this.$emit('updated');
      } catch (e) {
        console.log(e)
        this.$message.error(e.response.statusText);
      }
    },
    async getAttendance() {
      try {
        const {data} = await attendees.get(this.eventId);

        this.isAttending = false;
        for (const attendee of data) {
          if (attendee.attendeeId == this.userId) {
            this.isAttending = true;
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
  computed: {
    ...mapState ({
      userId: 'userId'
    })
  },
  mounted() {
    this.getAttendance();
  }
}
</script>

<style scoped>

</style>