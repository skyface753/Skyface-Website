import axios from "axios"
import { BACKENDURL } from "../constants"
export default function apiService (path, data) {
    return axios({
        url: BACKENDURL + path,
        method: "POST",
        data: data
    })
}