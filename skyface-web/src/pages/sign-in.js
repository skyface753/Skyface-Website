import React, { useContext } from "react";
// import { reactLocalStorage } from "reactjs-localstorage";
import GoogleLoginButton from "../components/google-login-button";
import "../styles/sign-up-in-style.css";
import apiService from "../services/api-service";
import GitHubLoginButton from "../components/GitHubLoginButton";
import { AuthContext } from "../App";

export default function SignIn() {
  const { state, dispatch } = useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  return (
    <div className="sign-in-container">
      <GoogleLoginButton />
      <GitHubLoginButton />
      <div className="container">
        <h1>Sign In</h1>
        <hr />

        <label htmlFor="username">
          <b>Username</b>
        </label>
        <input
          type="text"
          placeholder="Enter Username"
          name="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            apiService("login/manuelly", {
              username,
              password,
            }).then((response) => {
              if (response.data.success) {
                var user = response.data["user"];
                dispatch({
                  type: "LOGIN",
                  payload: {
                    user,
                    isLoggedIn: true,
                  },
                });
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
