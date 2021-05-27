<template>
  <el-row>
  <el-divider/>
  <h2 >Attendees:</h2>
  <el-divider/>
  </el-row>
  <el-row>
  <el-col :span="20" :offset="2">
  <el-table v-if="attendees.length !== 0" :data="attendees">
    <el-table-column label="Profile image">
      <template #default="scope">
        <el-image :src="getImage(scope.row)" style="width: 50px; height: 50px" fit="cover">
          <template #error>
            <i class="el-icon-user" style="font-size: 50px"/>
          </template>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="firstName" label="First name"/>
    <el-table-column prop="lastName" label="Last name"/>
    <el-table-column label="Date of interest">
      <template #default="scope">
        {{getDate(scope.row)}}
      </template>
    </el-table-column>
    <template v-if="organizer">
      <el-table-column prop="status" label="Status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'accepted'" type="success" effect="plain">Accepted</el-tag>
          <el-tag v-if="scope.row.status === 'pending'" type="warning" effect="plain">Pending</el-tag>
          <el-tag v-if="scope.row.status === 'rejected'" type="danger" effect="plain">Rejected</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="Operations">
        <template #default="scope">
          <el-button
              size="mini"
              type="success"
              @click="updateAttendee(scope.row, 'accepted')">Accept</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="updateAttendee(scope.row, 'rejected')">Reject</el-button>
        </template>
      </el-table-column>
    </template>
  </el-table>
    <h3 v-else>No attendees</h3>
  </el-col>
  </el-row>
</template>

<script>
import attendees from "@/api/attendees";
import users from '@/api/users';
export default {
  name: "Attendees",
  props: {
    eventId: Number,
    organizer: Boolean
  },
  emits: ['updated'],
  data() {
    return {
      attendees: [],
      isOrganizer: false
    }
  },
  methods: {
    async getAttendees() {
      try {
        const {data} = await attendees.get(this.eventId);
        this.attendees = data;
      } catch (e) {
        console.error(e);
      }
    },
    getDate(attendee) {
      const date = new Date(attendee.dateOfInterest);
      return date.toLocaleTimeString() + ', ' + date.toLocaleDateString();
    },
    getImage(attendee) {
      return users.getImagePath(attendee.attendeeId);
    },
    async updateAttendee(attendee, status) {
      try {
        await attendees.edit(this.eventId, attendee.attendeeId, status);
        this.$message.success(`Updated ${attendee.firstName} ${attendee.lastName}'s status to '${status}'`);
        await this.getAttendees();
        await this.$emit('updated');
      } catch (e) {
        console.error(e);
        this.$message.error(e.response.statusText);
      }
    },
  },
  mounted() {
    if (this.organizer !== undefined) this.isOrganizer = this.organizer;
    this.getAttendees();
  }
}
</script>