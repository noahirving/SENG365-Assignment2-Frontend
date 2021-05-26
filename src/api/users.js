import axios from "@/api/api.ts";

export default {
    getOne: (userId) => axios.get(`events/${userId}`),
    getImage: (userId) => axios.get(`events/${userId}/image`),
    getImagePath: (userId) =>  {
        return axios.defaults.baseURL + `users/${userId}/image`
    },
    register: (firstName, lastName, email, password) => {
        const body = {
            firstName,
            lastName,
            email,
            password
        };
        return axios.post('users/register', body);
    },
    login: (email, password) => {
        const body = {
            email,
            password
        };
        return axios.post('users/login', body);
    },
    logout: () => {
        return axios.post('users/logout');
    },
    edit: (userId, firstName, lastName, email) => {
        const body = {
            firstName,
            lastName,
            email
        };
        return axios.patch(`users/${userId}`, body);
    },
    editImage: (userId, file) => axios.put(`users/${userId}/image`, file)
}