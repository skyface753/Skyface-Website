import React, { useContext } from "react";
import GoogleLoginButton from "../components/google-login-button";
import apiService from "../services/api-service";
import "../styles/sign-up-in-style.css";
import { AuthContext } from "../App";

const SignUp = () => {
  const { state, dispatch } = useContext(AuthContext);
  var lastPage = document.referrer;
  // console.log("Last Page:" + document.referrer)
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [givenName, setGivenName] = React.useState("");
  const [familyName, setFamilyName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const setExampleData = () => {
    setUsername("example");
    setEmail("sjoerz@skyface.de");
    setGivenName("Example");
    setFamilyName("User");
    setPassword("example");
    setConfirmPassword("example");
  };

  return (
    <div
    // style={{
    // 	display: 'flex',
    // 	justifyContent: 'Right',
    // 	alignItems: 'Right',
    // 	height: '100vh'
    // }}
    >
      <h1>Sign Up</h1>
      <GoogleLoginButton />

      <div className="sign-in-up-container">
        <h1>Sign Up</h1>
        <p>Please fill in this form to create an account.</p>
        <button onClick={setExampleData}>Set Example Data</button>
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

        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <label htmlFor="confirmPassword">
          <b>Confirm Password</b>
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label htmlFor="givenName">
          <b>Given Name</b>
        </label>
        <input
          type="text"
          placeholder="Enter Given Name"
          name="givenName"
          required
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />

        <label htmlFor="familyName">
          <b>Family Name</b>
        </label>
        <input
          type="text"
          placeholder="Enter Family Name"
          name="familyName"
          required
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />

        <p>{error}</p>

        <p>
          By creating an account you agree to our{" "}
          <a href="#" style={{ color: "dodgerblue" }}>
            Terms & Privacy
          </a>
          .
        </p>

        <div class="clearfix">
          <button
            type="submit"
            className="sign-in-up-btn"
            onClick={() => {
              if (password !== confirmPassword) {
                setError("Passwords do not match");
              }
              apiService("register/manuelly", {
                username,
                password,
              }).then((res) => {
                if (!res.data.success) {
                  setError(res.data.message);
                  // alert(res.data.message);
                } else {
                  var user = res.data["user"];
                  dispatch({
                    type: "LOGIN",
                    payload: { user, isLoggedIn: true },
                  });
                  if (lastPage !== "") {
                    window.location.href = lastPage;
                  } else {
                    window.location.href = "/";
                  }
                }
              });
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
