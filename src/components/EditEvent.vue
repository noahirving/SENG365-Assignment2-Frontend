<template v-if="event !== undefined">

  <el-button
      type="primary"
      @click="visible = true">
    Edit
  </el-button>
  <!-- Create event -->
  <el-dialog
      title="Edit Event"
      v-model="visible">
    <el-tabs v-model="tab">
      <el-tab-pane label="Event">
    <el-form>
      <el-form-item label="Title">
        <el-input v-model="title"/>
      </el-form-item>
      <el-form-item label="Date, Time">
        <el-input v-model="date" type="datetime-local"/>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="description" type="textarea"/>
      </el-form-item>
      <el-form-item label="Capacity">
        <el-input-number v-model="capacity" @change="updateCapacity" :max="Infinity + 1"/>
      </el-form-item>
      <el-form-item label="Categories">
        <CategorySelector v-on:updated="updateCategoryIds" :initial-ids="event.categories"/>
      </el-form-item>
      <el-form-item label="Is Online">
        <el-checkbox v-model="isOnline" type="checkbox" @change="updateIsOnline"/>
      </el-form-item>
      <el-form-item label="URL" v-if="isOnline">
        <el-input v-model="url" :disabled="!isOnline"/>
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
      </el-tab-pane>
      <el-tab-pane label="Image">
        <el-form>
          <el-form-item label="Image">
            <ImageUploader v-on:image="setImage" :current-image-src="image.src"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" @click="editEvent">Save</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import events from "@/api/events";
import ImageUploader from "@/components/ImageUploader";
import CategorySelector from "@/components/CategorySelector";

export default {
  name: "EditEvent",
  components: {CategorySelector, ImageUploader},
  props: {
    event: Object,
    currentImage: Object
  },
  emits: ['updated'],
  data () {
    return {
      visible: false,
      tab: "0",

      title: "",
      categoryIds: [],
      date: "",
      image: {
        src: "",
        file: null
      },
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
    async editEvent() {
      try {
        let response = null;
        if (this.tab == '0') {
          response = await events.edit(this.event.id, this.getBody());
        } else {
          response = await events.editImage(this.event.id, this.image.file);
        }
        this.visible = false;
        await this.$emit('updated');
        await this.$message.success('Updated');
      } catch (e) {
        console.error(e);
        this.$message.error(e.response.statusText);
      }
    },
    getBody() {

      return {
        title: this.title,
        description: this.description,
        categoryIds: this.categoryIds,
        date: this.date,
        isOnline: this.isOnline,
        url: this.url,
        venue: this.venue,
        capacity: this.capacity,
        requiresAttendanceControl: this.requiresAttendanceControl,
        fee: this.fee
      }
    },
    updateCapacity() {
      if (this.capacity === 0) this.capacity = Infinity;
    },
    updateIsOnline() {
      if (this.isOnline) this.venue = "";
      else this.url = "";
    },
    setImage(image) {
      this.image = image;
    },
    setup() {
      this.title = this.event.title;
      this.description = this.event.description;
      this.categoryIds = this.event.categories;
      this.date = new Date(this.event.date).toISOString();
      this.isOnline = Boolean(this.event.isOnline);
      this.url = this.event.url || "";
      this.venue = this.event.venue || "";
      this.capacity = this.event.capacity;
      this.requiresAttendanceControl = Boolean(this.event.requiresAttendanceControl);
      this.fee = parseFloat(this.event.fee);

      this.image = this.currentImage;
    }
  }, watch: {
    tab() {
      this.image.src = "";
      this.setup();
    }
  },
  mounted() {
    this.setup();
  }
}
</script>