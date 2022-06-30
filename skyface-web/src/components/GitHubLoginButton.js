import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import GithubIcon from "mdi-react/GithubIcon";
import { AuthContext } from "../App";
import apiService from "../services/api-service";
import config from "../credentials";

export default function GitHubLoginButton() {
  const { state, dispatch } = useContext(AuthContext);
  const [data, setData] = useState({ errorMessage: "", isLoading: false });

  useEffect(() => {
    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);
      setData({ ...data, isLoading: true });

      const requestData = {
        code: newUrl[1],
      };

      console.log("Request data");
      console.log(requestData);
      apiService("login/github", {
        code: requestData.code,
      }).then((response) => {
        console.log("Response data axios");
        console.log(response);
        if (response.data.success) {
          console.log("Login success");
          console.log(response.data.user);
          const { user } = response.data;
          dispatch({
            type: "LOGIN",
            payload: { user, isLoggedIn: true },
          });
          // window.location.href = "/";
        }
      });
    }
  }, []);

  if (state.isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <div className="github-login-container">
      <>
        

        <a
          className="github-login-link"
          href={`https://github.com/login/oauth/authorize?scope=user&client_id=${config.REACT_APP_CLIENT_ID}&redirect_uri=${config.REACT_APP_REDIRECT_URI}`}
          onClick={() => {
            // setData({ ...data, errorMessage: "" });
          }}
        >
          <GithubIcon />
          <span>Login with GitHub</span>
        </a>
      </>
    </div>
  );
}
