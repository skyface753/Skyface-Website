// Learn more about createBottomTabNavigator:
// https://reactnavigation.org/docs/bottom-tab-navigator
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/Colors";
import Blogs from "../screens/blogs";
import Categories from "../screens/categories";
import SettingsScreen from "../screens/Settings";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  return (
    <BottomTab.Navigator
      initialRouteName="Blogs"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: true,
      }}
    >
      <BottomTab.Screen
        name="Blogs"
        component={BlogsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="document-text-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Categories"
        component={CategoriesNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings-outline" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const BlogsStack = createStackNavigator();

function BlogsNavigator() {
  return (
    <BlogsStack.Navigator>
      <BlogsStack.Screen
        name="BlogsScreen"
        component={Blogs}
        options={{ headerShown: false }}
        // options={{ headerTitle: "Blogs" }}
      />
    </BlogsStack.Navigator>
  );
}

const CategoriesStack = createStackNavigator();

function CategoriesNavigator() {
  return (
    <CategoriesStack.Navigator>
      <CategoriesStack.Screen
        name="CategoriesScreen"
        component={Categories}
        options={{ headerShown: false }}
      />
    </CategoriesStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </SettingsStack.Navigator>
  );
}