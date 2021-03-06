// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";
import SingleCategoryScreen from "../screens/SingleCategory";
import NotFoundScreen from "../screens/NotFoundScreen";
import SingleBlog from "../screens/SingleBlog";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator}
     
      />
      <Stack.Screen
        name="SingleBlog"
        component={SingleBlog}
        options={({ route }) => ({ headerShown: true, title: route.params.name })}
      />
      <Stack.Screen name="SingleCategory" component={SingleCategoryScreen} options={({ route }) => ({ headerShown: true, title: route.params.name })} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ route }) => ({ headerShown: true })}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
