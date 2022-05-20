import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import { reactLocalStorage } from "reactjs-localstorage";

export default function Navbar() {
  var loggedInUser = reactLocalStorage.getObject("loggedInUser", null);
  var jwt = reactLocalStorage.get("jwt", null);
  console.log(loggedInUser);
  //   if (loggedInUser != null) {
  //     if (loggedInUser.length == undefined) {
  //       loggedInUser = null;
  //       reactLocalStorage.setObject("loggedInUser", null);
  //       console.log("loggedInUser is undefined");
  //     }
  //   }
  return (
    <>
      <Nav /*style={scrollDirection === "down" ? styles.active: styles.hidden}*/
      >
        <Bars />
        <NavMenu>
          <NavLink to="/">Home</NavLink>

          <NavLink to="/about">About</NavLink>
          <NavLink to="/blogs">Blogs</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          {/* Logout Button if isLoggedIn = true */}

          {/* <NavLink to='/sign-up' activeStyle>
			Sign Up
		</NavLink> */}
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        {/* <NavBtn>
		<NavBtnLink to='/signin'>Sign In</NavBtnLink>
		</NavBtn> */}
        <NavBtn>
          {loggedInUser ? (
            <NavBtnLink
              to="/"
              onClick={() => {
                googleLogout();
                reactLocalStorage.setObject("loggedInUser", null);
                reactLocalStorage.set("jwt", null);
                window.location.reload();
              }}
            >
              Logout
            </NavBtnLink>
          ) : (
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                console.log(credentialResponse);
                const res = await fetch(
                  "http://localhost:5000/api/v1/auth/google",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      token: credentialResponse.credential,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                const data = await res.json();
                console.log(data);
                reactLocalStorage.setObject("loggedInUser", data);
                reactLocalStorage.set("jwt", data.token);
                //Refresh the page
                window.location.reload();
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          )}
        </NavBtn>
        <NavBtn>
          {loggedInUser ? (
            <img
              className="profile-pic"
              src={loggedInUser.user.picture}
              alt="User Picture"
            />
          ) : (
            <NavBtnLink to="/signin">Sign In</NavBtnLink>
          )}
        </NavBtn>
      </Nav>
    </>
  );
}
