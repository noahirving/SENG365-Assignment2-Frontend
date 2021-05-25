import axios from "@/api/api.ts";

export default {
    getOne: (userId) => axios.get(`events/${userId}`),
    getImage: (userId) => axios.get(`events/${userId}/image`),
    getImagePath: (userId) =>  {
        return axios.defaults.baseURL + `users/${userId}/image`
    },
}