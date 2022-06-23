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
        console.log(error);
        // alert(error);
      }
    });
}
