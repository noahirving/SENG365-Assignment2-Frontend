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
    get: (eventId) => axios.get(`events/${eventId}`),
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
        console.log(body);
        return axios.post(`events`, body);
    },
    editImage: (eventId, file) => {
        const headers = {
            'Content-type': file.type
        }
        return axios.put(`events/${eventId}/image`, file, {headers});
    },
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