import { reactLocalStorage } from "reactjs-localstorage";

export default function CheckLogin(){
    const loggedInUser = reactLocalStorage.getObject("loggedInUser");
    if(loggedInUser){
        return true;
    }
    return false;
}