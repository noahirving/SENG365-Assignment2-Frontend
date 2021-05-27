import axios from "@/api/api.ts";

export default {
    get: (eventId) => axios.get(`events/${eventId}/attendees`),
    create: (eventId) => axios.post(`events/${eventId}/attendees`),
    delete: (eventId) => axios.delete(`events/${eventId}/attendees`),
    edit: (eventId, userId, status) => axios.patch(`events/${eventId}/attendees/${userId}`, {status})
}