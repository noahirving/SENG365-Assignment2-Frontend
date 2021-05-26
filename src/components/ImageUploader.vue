<template>
  <input type="file" :onchange="previewFile" autocomplete="off" :maxlength="inputWidth" :accept="acceptedTypes"/>

  <el-image ref="image" :src="image.src" height="200" alt="Image preview...">
    <template #error>
      <div class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </template>
  </el-image>

</template>

<script>
export default {
  name: "ImageUploader",
  emits: ["image"],
  data() {
    return {
      labelWidth: 200,
      inputWidth:200,
      image: {
        src: "",
        type: "",
        name: "",
        file: "",
      },
      file: "",
      acceptedTypes: [
          'image/png',
          'image/jpeg',
          'image/gif'
      ]
    }
  },
  methods: {
    previewFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (!this.acceptedTypes.includes(file.type)) {
        event.target.value = '';
        return;
      }

      reader.onload = this.updateImage;
      if (file) {
        this.image.file = file;
        reader.readAsDataURL(file);
      }
    },
    updateImage(e) {
      this.image.src = e.target.result;
      this.$emit("image", this.image);
    }

  }
}
</script>

<style scoped>

</style>