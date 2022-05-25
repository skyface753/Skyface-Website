import { Text, View } from "../components/Themed";
import { Button, StyleSheet } from "react-native";
import { googleLogout } from "@react-oauth/google";
import { reactLocalStorage } from "reactjs-localstorage";
import CheckLogin from "../services.js/CheckLogin";
export default function SettingsScreen({ route, navigation }) {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Setting Screen</Text>
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
        <Button title="Register" onPress={() => navigation.navigate("Register")} />
        {CheckLogin() ? (
        <Button title="Logout" onPress={() => {
            googleLogout();
            reactLocalStorage.setObject("loggedInUser", null);
            reactLocalStorage.set("jwt", null);
        }} /> ) : null}
        </View>
    );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
        },
    });