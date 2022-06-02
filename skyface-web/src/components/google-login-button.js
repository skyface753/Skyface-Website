import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../App";
import { BACKENDURL } from "../consts";
import apiService from "../services/api-service";

export default function GoogleLoginButton() {
  const { state, dispatch } = useContext(AuthContext);
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        console.log(credentialResponse);
        const res = await apiService("login/google", {
          token: credentialResponse.credential
        }).then((res) => {
          console.log(res);
          if (res.data.success) {
            const { user } = res.data;
            dispatch({
              type: "LOGIN",
              payload: { user, isLoggedIn: true }
            });
          }
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
