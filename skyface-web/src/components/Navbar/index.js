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
import "../../styles/navbar.css"
import { useState } from "react";

export default function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  var loggedInUser = reactLocalStorage.getObject("loggedInUser", null);
  var jwt = reactLocalStorage.get("jwt", null);
  console.log(loggedInUser);
  return (
    <nav className="navigation">
      <a href="/" className="brand-name">
        SkyBlog
      </a>
      <button className="hamburger"
      onClick={() => {
        setIsNavExpanded(!isNavExpanded);
      }}
      >
        {/* icon from heroicons.com */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/blogs">Blogs</a>
          </li>
          <li>
            <a href="/Categories">Categories</a>
          </li>
          <li>
            <a href="/series">Series</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          {loggedInUser != null ? (
            loggedInUser.role == "admin" ? (
              <li>
                <a href="/admin">Admin</a>
              </li>
            ) : (
              null)
          ) : (
            null
          )} 
          {loggedInUser ? (
            <li>

            
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
          </li>
        ) : (
          null
          // <NavMenu>
          //   <NavBtnLink to="/sign-in">Sign In</NavBtnLink>
          //   <NavBtnLink to="/sign-up">Sign Up</NavBtnLink>
          // </NavMenu>
        )}
        </ul>
      </div>
    </nav>
    // <>
    //   <Nav
    //   >
    //     <Bars />
    //     <NavMenu>
    //       <NavLink to="/">Home</NavLink>

    //       <NavLink to="/about">About</NavLink>
    //       <NavLink to="/blogs">Blogs</NavLink>
    //       <NavLink to="/categories">Categories</NavLink>
    //       <NavLink to="/series">Series</NavLink>
    //       {loggedInUser != null ? (
    //         loggedInUser.role == "admin" ? (
    //           <NavLink to="/admin">Admin</NavLink>
    //         ) : null
    //       ) : null}
    //     </NavMenu>
    //     {loggedInUser ? (
    //       <div className="loggedInUserMenu">
    //         <div className="loggedInUserMenu-Button">
    //           {loggedInUser.picture ? (
    //             <img
    //               className="profile-pic"
    //               src={loggedInUser.picture}
    //               alt="User Picture"
    //             />
    //           ) : (
    //             <img
    //               className="profile-pic"
    //               src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
    //               alt="User Picture"
    //             />
    //           )}
    //         </div>
    //         <div className="loggedInUser-dropdown-content">
    //           {/* <a href={"/users" + loggedInUser.user.username}>{loggedInUser.user.name}</a> */}
    //           <a href={"/users/" + loggedInUser.username}>Profile</a>
    //           {/* Logout */}
    //           <a
    //             href="/"
    //             onClick={() => {
    //               if (loggedInUser.provider == "google") {
    //                 googleLogout();
    //               }
    //               reactLocalStorage.setObject("loggedInUser", null);
    //               reactLocalStorage.set("jwt", null);
    //               window.location.reload();
    //             }}
    //           >
    //             Logout
    //           </a>
    //         </div>
    //       </div>
    //     ) : (
    //       <NavMenu>
    //         <NavBtnLink to="/sign-in">Sign In</NavBtnLink>
    //         <NavBtnLink to="/sign-up">Sign Up</NavBtnLink>
    //       </NavMenu>
    //     )}
    //   </Nav>
    // </>
  );
}
