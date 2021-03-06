import { ActivityIndicator, Button, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import apiService from "../services.js/ApiService";
import BlogPreview from "../components/BlogPreview";

// class Blogs {
//   constructor(id, title, subtitle, url, navigation) {
//     this.id = id;
//     this.title = title;
//     this.subtitle = subtitle;
//     this.url = url;
//     this.navigation = navigation;
//   }
//   showBlog() {
//     return <BlogPreview currBlog={this} navigation={this.navigation} />;
//   }
// }

export default function Blogs() {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiService("blogs")
      .then((response) => {
        setBlogs(response.data);
        // setError(response.data);
      })
      .catch((error) => {
        // setError(error);
      });
  }, []);
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.title}>{error.message}</Text>
      </View>
    );
  }
  if (!blogs) return <ActivityIndicator />;

  return (
    <ScrollView style={styles.scrollView}>
      {/* <Button
        title="Go to Login"
        onPress={() => navigation.navigate("Login")}
      /> */}
      {blogs.map((blog) => {
        return <BlogPreview currBlog={blog} navigation={navigation} />;
      })}
      {/* {(() => {
        const blogDivs = [];
        for (let i = 0; i < blogs.length; i++) {
          blogDivs.push(BlogPreview(blogs[i], navigation));
        }
        return blogDivs;
      })()} */}
    </ScrollView>
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
  scrollView: {
    padding: 20,
  },
});
