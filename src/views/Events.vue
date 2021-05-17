<template>
<h1>Events</h1>

  <ol>
    <li v-for="event in events" :key="event.id">
      {{event.title}}
    </li>
  </ol>

</template>

<script>
export default {
  name: "Events",
  data() {
    return {
      events: []
    }
  },
  methods: {
    async getEvents() {
      const {status, data} = await this.axios.get("events");
      if (status === 200) {
        this.events = data;
      }
    }
  },
  mounted() {
    this.getEvents();
  }
}
</script>

<style scoped>

</style>