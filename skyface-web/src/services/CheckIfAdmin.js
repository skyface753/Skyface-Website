import { reactLocalStorage } from "reactjs-localstorage";

export default function CheckIfAdmin(){
    var loggedInUser = reactLocalStorage.getObject("loggedInUser");
    if(loggedInUser != null){
        if(loggedInUser.role == "admin"){
            return true;
        }
    }
    return false;
}
