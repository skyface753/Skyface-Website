import { GoogleLogin } from "@react-oauth/google";
import { reactLocalStorage } from "reactjs-localstorage";
import { BACKENDURL } from "../consts";
import apiService from "../services/api-service";

export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        console.log(credentialResponse);
        const res = await apiService("api/v1/auth/google", {
          token: credentialResponse.credential
        }).then((res) => {
          console.log(res);
          reactLocalStorage.setObject("loggedInUser", res.data.user);
        });

        // const data = await res.json();
        // console.log(data);
        // reactLocalStorage.set("jwt", data.token);
        window.location.href = "/";
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
