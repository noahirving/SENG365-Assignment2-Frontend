<template>
  <el-button type="danger" @click="visible = true">Delete</el-button>

  <el-dialog
      title="Warning"
      v-model="visible"
      width="30%"
      center>
    <span>Are your sure you want to delete this event?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="danger" @click="deleteEvent">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import events from "@/api/events";

export default {
  name: "DeleteEvent",
  props: {
    id: Number
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    async deleteEvent() {
      try {
        await events.delete(this.id);
        this.$message.success('Event deleted');
        await this.$router.push('/events');
        this.visible = false;
      } catch (e) {
        console.error(e)
        this.$message.error(e.response.statusText);
      }
    }
  }
}
</script>