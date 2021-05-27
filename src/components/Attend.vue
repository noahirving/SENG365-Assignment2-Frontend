<template>
  <el-button v-if="!isAttending" type="success" @click="attend">Attend</el-button>
  <el-button v-else type="danger" @click="removeAttendance">Remove attendance</el-button>
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
      isAttending: false
    }
  },
  methods: {
    async attend() {
      try {
        await attendees.create(this.eventId);
        this.isAttending = true;
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
        this.isAttending = false;
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