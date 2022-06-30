import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlashMessage from "react-native-flash-message";
import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";
import { useColorScheme } from "react-native";
export default function App() {
  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      // <GoogleOAuthProvider clientId={getCredentials()}>

      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      <FlashMessage position="top" /> 
      </SafeAreaProvider>
      // </GoogleOAuthProvider>
    );
  }
}
