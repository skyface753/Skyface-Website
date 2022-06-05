import axios from "axios";
import { BACKENDURL } from "../consts";
axios.defaults.withCredentials = true;

export default async function apiService(path, data) {
  return await axios
    .post(BACKENDURL + path, data, { withCredentials: true })
    .catch((error) => {
      alert(error);
    });
}
