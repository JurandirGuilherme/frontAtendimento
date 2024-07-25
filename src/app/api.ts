import axios from "axios";


const api = axios.create({baseURL:'http://172.19.238.23:3333/'})



export {api}