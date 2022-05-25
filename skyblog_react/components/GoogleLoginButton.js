import { GoogleLogin } from "@react-oauth/google";
import { reactLocalStorage } from "reactjs-localstorage";
import { BACKENDURL } from "../constants";
import apiService from "../services.js/ApiService";
export default function GoogleLoginButtonApp() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        console.log(credentialResponse);
        apiService("api/v1/auth/google", {
            token: credentialResponse.credential,
          }).then((response) => {
            console.log(response);
            
        const data = response.data;
        console.log(data);
        reactLocalStorage.setObject("loggedInUser", data.user);
        reactLocalStorage.set("jwt", data.token);
        // window.location.href = "/";
      });
      }}
      onError={(error) => {
        console.log(error);
      }}
    />
  );
}
