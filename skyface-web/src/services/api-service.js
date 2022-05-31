import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { BACKENDURL } from "../consts";
var loggedInUser = reactLocalStorage.getObject("loggedInUser", null);
var jwt = reactLocalStorage.get("jwt", null);
axios.defaults.withCredentials = true;

export default async function apiService(path, data) {
  return await axios.post(BACKENDURL + path, data, {withCredentials: true}
  ).catch(error => {
    alert(error);
  });
}