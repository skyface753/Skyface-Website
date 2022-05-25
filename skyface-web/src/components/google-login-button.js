import { GoogleLogin } from "@react-oauth/google";
import { reactLocalStorage } from "reactjs-localstorage";
import { BACKENDURL } from "../consts";
export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        console.log(credentialResponse);
        const res = await fetch(BACKENDURL + "api/v1/auth/google", {
          method: "POST",
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        reactLocalStorage.setObject("loggedInUser", data.user);
        reactLocalStorage.set("jwt", data.token);
        window.location.href = "/";
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
