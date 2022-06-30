import axios from "axios"
import { BACKENDURL } from "../constants"
// axios.defaults.withCredentials = true
export default function apiService (path, data) {
    return axios({
        url: BACKENDURL + path,
        method: "POST",
        data: data,
        // withCredentials: true
    }).catch(err => {
        console.log(err)
    })
}