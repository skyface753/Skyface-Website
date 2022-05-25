import { View, Text, TextInput, Button } from "react-native";
import GoogleLoginButtonApp from "../components/GoogleLoginButton";
import CheckLogin from "../services.js/CheckLogin";
import { StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View>
      <Text>LoginScreen</Text>
        <GoogleLoginButtonApp />
        <Text style={styles.loginStatus}> {CheckLogin() ? "Logged in" : "Not logged in"} </Text>
        <TextInput placeholder="Username" />
        <TextInput placeholder="Password" />
        <Button
            title="Login"
            onPress={() => navigation.navigate("Home")}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  loginStatus: {
    color: "white"
  }
});