<template>
  <el-dropdown :hide-on-click="false" :max-height="300">
    <el-button type="primary">
      Categories<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="clearActive">Clear</el-dropdown-item>
        <el-dropdown-item v-for="(category, id) in categories" :key="id">
          <el-checkbox v-model="activeCategories[id]" @change="updateSelected">
            {{category}}
          </el-checkbox>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import events from '@/api/events';
export default {
  name: "CategorySelector",
  props: {
    initialIds: Array
  },
  emits: ['updated'],
  data() {
    return {
      categories: {},
      activeCategories: {}
    }
  },
  computed: {
    selectedCategories() {
      const selected = [];
      for (const [id, active] of Object.entries(this.activeCategories)) {
        if (active) selected.push(parseInt(id));
      }
      return selected;
    }
  },
  methods: {
    clearActive() {
      for (const id of Object.keys(this.activeCategories)) {
        this.activeCategories[id] = false;
      }
      this.updateSelected()
    },
    updateSelected () {
      console.log(this.selectedCategories);
      this.$emit('updated', this.selectedCategories);
    },
    async getCategories() {
      try {
        const {status, data} = await events.getCategories();
        this.categories = data;
        this.activeCategories = {};
        for (const [id, _] of Object.entries(this.categories)) {
          this.activeCategories[id] = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    setInitialActive() {
      for (const [id, _] of Object.entries(this.activeCategories)) {
        if (this.initialIds.includes(parseInt(id))) {
          this.activeCategories[id] = true;
        }
      }
    },
    async setup() {
      await this.getCategories();
      if (this.initialIds !== undefined){
        this.setInitialActive()
      }
    }
  },
  mounted() {
    this.setup()
  }
}
</script>

<style scoped>

</style>