<template>
  <input ref="input" type="file" :onchange="previewFile" autocomplete="off" :maxlength="inputWidth" :accept="acceptedTypes"/>
  <el-button type="danger" @click="deleteImage">Delete Image</el-button>
  <br>

  <el-image v-if="image.src !== ''" ref="image" :src="image.src" height="200" alt="Image preview...">
    <template #error>No Image</template>
  </el-image>

</template>

<script>
export default {
  name: "ImageUploader",
  props: {
    currentImageSrc: String
  },
  emits: ["image"],
  data() {
    return {
      labelWidth: 200,
      inputWidth:200,
      image: {
        src: "",
        file: null,
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
    },
    setCurrentImage() {
      if (this.currentImageSrc !== undefined) {
        this.image.src = this.currentImageSrc;
      }
    },
    deleteImage() {
      this.image = {
        src: "",
        file: null,
      }
      this.$refs.input.value = '';
      this.$emit("image", this.image);
    }
  },
  watch: {
    currentImageSrc() {
      this.image.src = this.currentImageSrc;
    }
  },
  mounted() {
    this.setCurrentImage();

  }
}
</script>

<style scoped>

</style>