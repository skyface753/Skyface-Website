import axios from "axios";
import { BACKENDURL } from "../consts";
axios.defaults.withCredentials = true;

export default async function apiService(path, data, noError) {
  // console.log("BACKENDURL: " + BACKENDURL);
  return await axios
    .post(BACKENDURL + path, data, { withCredentials: true })
    .catch((error) => {
      if (noError) {
      } else {
        if (window.location.href.includes("localhost")) {
          console.error(error);
        }
      }
    });
}
