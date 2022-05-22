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
          {loggedInUser != null ? (
            loggedInUser.role == "admin" ? (
              <NavLink to="/admin">Admin</NavLink>
            ) : null
          ) : null}

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
        {/* <NavBtn>
          {loggedInUser ? (
            <NavBtnLink
              to="/"
              onClick={() => {
                if (loggedInUser.user.provider == "google") {
                  googleLogout();
                }
                reactLocalStorage.setObject("loggedInUser", null);
                reactLocalStorage.set("jwt", null);
                window.location.reload();
              }}
            >
              Logout
            </NavBtnLink>
          ) : (
            
          )}
        </NavBtn> */}
        {loggedInUser ? (
          <div className="loggedInUserMenu">
            <div className="loggedInUserMenu-Button">
              {loggedInUser.picture ? (
                <img
                  className="profile-pic"
                  src={loggedInUser.picture}
                  alt="User Picture"
                />
              ) : (
                <img
                  className="profile-pic"
                  src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                  alt="User Picture"
                />
              )}
            </div>
            <div className="loggedInUser-dropdown-content">
              {/* <a href={"/users" + loggedInUser.user.username}>{loggedInUser.user.name}</a> */}
              <a href={"/users/" + loggedInUser.username}>Profile</a>
              {/* Logout */}
              <a
                href="/"
                onClick={() => {
                  if (loggedInUser.provider == "google") {
                    googleLogout();
                  }
                  reactLocalStorage.setObject("loggedInUser", null);
                  reactLocalStorage.set("jwt", null);
                  window.location.reload();
                }}
              >
                Logout
              </a>
            </div>
          </div>
        ) : (
          <NavMenu>
            <NavBtnLink to="/sign-in">Sign In</NavBtnLink>
            <NavBtnLink to="/sign-up">Sign Up</NavBtnLink>
          </NavMenu>
        )}
      </Nav>
    </>
  );
}
