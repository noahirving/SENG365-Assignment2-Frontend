import axios from "@/api/api.ts";

export default {
    getAll: () => axios.get(`events`),
    getOne: (eventId) => axios.get(`events/${eventId}`),
    getImage: (eventId) => axios.get(`events/${eventId}/image`),
    getImagePath: (eventId) =>  {
        return axios.defaults.baseURL + `events/${eventId}/image`
    },
    getCategories: async () => {
        const response = await axios.get(`events/categories`);
        const categories = {};
        for (const category of response.data) {
            categories[category.id] = category.name;
        }

        response.data = categories;
        return response;

    },
    create: (
        title,
         description,
         categoryIds,
         date,
         isOnline,
         url,
         venue,
         capacity,
         requiresAttendanceControl,
         fee
    ) => {
        const body = {
            title,
            description,
            categoryIds,
            date,
            isOnline,
            url,
            venue,
            capacity,
            requiresAttendanceControl,
            fee,
        };
        console.log(body);
        return axios.post(`events`, body);
    }
}