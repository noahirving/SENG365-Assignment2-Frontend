import axios from "@/api/api.ts";

export default {
    get: (userId) => axios.get(`users/${userId}`),
    getImage: (userId) => axios.get(`users/${userId}/image`),
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
    edit: (userId, body) => axios.patch(`users/${userId}`, body),
    editImage: (userId, file) => {
        const headers = {
            'Content-type': file.type
        }
        return axios.put(`users/${userId}/image`, file, {headers});
    },
    deleteImage: (userId) => axios.delete(`users/${userId}/image`)

}