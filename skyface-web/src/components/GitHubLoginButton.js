import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import Styled from "styled-components";
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
      {/* {data.isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : ( */}
      <>
        {
          // Link to request GitHub access
        }

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

const Wrapper = Styled.section`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial;
    
    > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      width: 25%;
      height: 45%;
      > h1 {
        font-size: 2rem;
        margin-bottom: 20px;
      }
      > span:nth-child(2) {
        font-size: 1.1rem;
        color: #808080;
        margin-bottom: 70px;
      }
      > span:nth-child(3) {
        margin: 10px 0 20px;
        color: red;
      }
      .login-container {
        background-color: #000;
        width: 70%;
        border-radius: 3px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        > .login-link {
          text-decoration: none;
          color: #fff;
          text-transform: uppercase;
          cursor: default;
          display: flex;
          align-items: center;          
          height: 40px;
          > span:nth-child(2) {
            margin-left: 5px;
          }
        }
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;          
          height: 40px;
        }
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
`;
