import axios from "axios";

axios.defaults.baseURL = 'http://localhost:4941/api/v1/';
axios.defaults.headers.common['X-Authorization'] = null;

export default axios;