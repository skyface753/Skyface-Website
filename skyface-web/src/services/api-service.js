import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { BACKENDURL } from "../consts";
var loggedInUser = reactLocalStorage.getObject("loggedInUser", null);
var jwt = reactLocalStorage.get("jwt", null);

export default async function apiService(path, data) {
  console.log("jwt: " + jwt);
  return await axios.post(BACKENDURL + path, data, {
    headers: {
      Authorization: jwt,
    },
  });
}

// var jwt = "";
// const apiRequest = async (path, data) => {
//   return axios.post(baseURL + path, data, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: jwt,
//     },
//   });
// };
// const ApiService = {
//   getSingleBlog: async (blogUrl) => {
//     return apiRequest("blog/" + blogUrl, {});
//   },
// };

// export default ApiService;
