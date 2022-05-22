import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { reactLocalStorage } from "reactjs-localstorage";
import GoogleLoginButton from "../components/google-login-button";
import "../styles/sign-up-in-style.css";
import apiService from "../services/api-service";

export default function SignIn() {
  const [usernameOrMail, setUsernameOrMail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const setExampleData = () => {
    setUsernameOrMail("example");
    setPassword("example");
  };

  return (
    <div>
      <GoogleLoginButton />;
      <div className="container">
        <h1>Sign In</h1>
        <button onClick={setExampleData}>Set Example Data</button>
        <hr />

        <label htmlFor="usernameOrMail">
          <b>Username or Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter Username or Email"
          name="usernameOrMail"
          required
          value={usernameOrMail}
          onChange={(e) => setUsernameOrMail(e.target.value)}
        />

        <label htmlFor="password">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p>{error}</p>

        <button
          className="sign-in-up-btn"
          onClick={() => {
            apiService("sign-in", {
              usernameOrMail,
              password,
            }).then((response) => {
              if (response.data.success) {
                var user = response.data["user"];
                var token = response.data["token"];
                reactLocalStorage.setObject("loggedInUser", user);
                reactLocalStorage.set("jwt", token);
                console.log("logged in");
                window.location.href = "/";
              } else {
                setError(response.data.message);
              }
            });
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
