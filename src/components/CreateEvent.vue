<template>

  <el-button
      type="primary"
      @click="visible = true">
    Create Event
  </el-button>
  <!-- Create event -->
  <el-dialog
      title="New Event"
      v-model="visible">
    <el-form>
      <el-form-item label="Title">
        <el-input v-model="title"/>
      </el-form-item>
      <el-form-item label="Date, Time">
        <el-input v-model="date" type="datetime-local"/>
      </el-form-item>
      <el-form-item label="Image">
        <ImageUploader v-on:image="setImage"/>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="description" type="textarea"/>
      </el-form-item>
      <el-form-item label="Capacity">
        <el-input-number v-model="capacity" @change="updateCapacity" :max="Infinity + 1"/>
      </el-form-item>
      <el-form-item label="Categories">
        <CategorySelector v-on:updated="updateCategoryIds"/>
      </el-form-item>
      <el-form-item label="Is Online">
        <el-checkbox v-model="isOnline" type="checkbox" @change="updateIsOnline"/>
      </el-form-item>
      <el-form-item label="URL">
        <el-input v-model="url" />
      </el-form-item>
      <el-form-item label="venue" v-if="!isOnline">
        <el-input v-model="venue" :disabled="isOnline"/>
      </el-form-item>
      <el-form-item label="requiresAttendanceControl">
        <el-checkbox v-model="requiresAttendanceControl" type="checkbox"/>
      </el-form-item>
      <el-form-item label="fee">
        <el-input-number v-model="fee" :min="0"/>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="close()">Cancel</el-button>
      <el-button type="primary" @click="createEvent">Save</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import events from "@/api/events";
import ImageUploader from "@/components/ImageUploader";
import CategorySelector from "@/components/CategorySelector";

export default {
  name: "CreateEvent",
  components: {CategorySelector, ImageUploader},
  emits: ['created'],
  data () {
    return {
      visible: false,


      title: "",
      categoryIds: [],
      date: "",
      image: {},
      description: "",
      capacity: 1,
      isOnline: false,
      url: "",
      venue: "",
      requiresAttendanceControl: false,
      fee: 0
    }
  },
  methods: {
    updateCategoryIds(ids) {
      this.categoryIds = ids;
    },
    async createEvent() {
      if (Object.keys(this.image).length === 0) {
        this.$message.error('Requires an image');
        return;
      }
      try {
        const {status, data} = await events.create(
            this.title,
            this.description,
            this.categoryIds,
            this.date,
            this.isOnline,
            this.url,
            this.venue,
            this.capacity,
            this.requiresAttendanceControl,
            this.fee
        );

        if (status === 201) {
          const response = await events.editImage(data.eventId, this.image.file);
          this.close()
          this.$emit('created');
          this.$message.success('Created');

        }
      } catch (e) {
        console.error(e);
        this.$message.error(e.response.statusText);
      }
    },
    updateCapacity() {
      if (this.capacity === 0) this.capacity = Infinity;
    },
    updateIsOnline() {
      if (this.isOnline) this.venue = "";
    },
    setImage(image) {
      console.log(image);
      this.image = image;
    },
    close() {
      this.visible = false;
      this.title = ""
      this.categoryIds = []
      this.date = ""
      this.image = {}
      this.description = ""
      this.capacity = 1
      this.isOnline = false
      this.url = ""
      this.venue = ""
      this.requiresAttendanceControl = false
      this.fee = 0
    }
  }
}
</script>

<style scoped>

</style>