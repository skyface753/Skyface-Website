import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../App";
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
        window.location.href = "/";
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
