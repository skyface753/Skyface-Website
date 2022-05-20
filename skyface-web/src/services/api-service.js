import axios from "axios";
const baseURL = "http://localhost:5000/";

export default async function apiService(path, data) {
  return await axios.post(baseURL + path, data);
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
