import { useContext } from "react";
import { AuthContext } from "../App";

export default function CheckIfAdmin() {
  const { state, dispatch } = useContext(AuthContext);
  const user = state.user;
  const isLoggedIn = state.isLoggedIn;
  // console.log("CheckIfAdmin: " + isLoggedIn);
  // console.log(user);
  if (isLoggedIn) {
    if (user.role === "admin") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
