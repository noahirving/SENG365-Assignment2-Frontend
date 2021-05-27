import axios from "@/api/api.ts";

export default {
    getAll: async (params) => {

        const response = await axios.get(`events`, {params});
        if (response.status !== 200) return response;
        const events = response.data;
        const {data} = await getCategories();
        const categories = data;
        for (const event of events) {
            event.categoryNames = event.categories.map(id => categories[id]);
        }
        return {status: 200, data: events};
    },
    get: async (eventId) => {
        const response = await axios.get(`events/${eventId}`);
        if (response.status !== 200) return response;
        const event = response.data;
        const {data} = await getCategories();
        const categories = data;
        event.categoryNames = event.categories.map(id => categories[id]);

        return {status: 200, data: event};
    },
    getImage: (eventId) => axios.get(`events/${eventId}/image`),
    getImagePath: (eventId) =>  {
        return axios.defaults.baseURL + `events/${eventId}/image`
    },
    getCategories,
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
        return axios.post(`events`, body);
    },
    edit: (eventId, body) => {
        console.log('trying')
        return axios.patch(`events/${eventId}`, body);

    },
    editImage: (eventId, file) => {
        const headers = {
            'Content-type': file.type
        }
        return axios.put(`events/${eventId}/image`, file, {headers});
    },
    delete: (eventId) => axios.delete(`events/${eventId}`),
}
async function getCategories() {
    const response = await axios.get(`events/categories`);
    const categories = {};
    for (const category of response.data) {
        categories[category.id] = category.name;
    }
    response.data = categories;
    return response;
}