import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
const baseURL = "http://localhost:5000/";
var loggedInUser = reactLocalStorage.getObject("loggedInUser", null);
var jwt = reactLocalStorage.get("jwt", null);

export default async function apiService(path, data) {
  console.log("jwt: " + jwt);
  return await axios.post(baseURL + path, data, {
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
