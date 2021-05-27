<template>
  <h2>My Events</h2>
  <EventCard v-for="event in myEvents" :event="event" :key="event"></EventCard>
</template>

<script>
import EventCard from "@/components/EventCard";
import events from "@/api/events";
export default {
  name: "MyEvents",
  components: {EventCard},
  props: {
    userId: Number
  },
  data() {
    return {
      myEvents: [],
    }
  },
  methods: {
    async getEvents() {
      try {
        const {data} = await events.getAll();
        for (const event of data) {
          const {data} = await events.get(event.eventId);
          if (data.organizerId === this.userId) {
            this.myEvents.push(event);
          }
        }
      } catch (e) {
        console.error(e);
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