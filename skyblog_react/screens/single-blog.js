import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { BACKENDURL } from "../constants.js";
import * as Clipboard from "expo-clipboard";
import { ScrollView } from "react-native-gesture-handler";

export default function SingleBlog({ route, navigation }) {
  const blogFromBlogs = route.params.blog;

  const [blogContent, setBlogContent] = useState(null);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.post(BACKENDURL + "blog/" + blogFromBlogs.url).then((response) => {
      console.log(response.data);
      setBlog(response.data["blog"]);
      setBlogContent(response.data["blogContent"]);
    });
  }, []);

  if (!blog) return <View className="loader" />;

  if (!blogContent) return <View className="loader" />;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.subtitle}>{blog.subtitle}</Text>
        <View style={styles.separator} />
        {(() => {
          const blogDivs = [];
          console.log(blogContent);
          for (let i = 0; i < blogContent.length; i++) {
            if (blogContent[i].type == "text") {
              blogDivs.push(
                <View key={blogContent[i]._id} style={styles.blogContentView}>
                  <Text style={styles.blogContent}>
                    {blogContent[i].content}
                  </Text>
                </View>
              );
            } else if (blogContent[i].type == "code") {
              blogDivs.push(
                <View key={blogContent[i]._id} style={styles.blogContentView}>
                  <TouchableOpacity
                    onLongPress={() =>
                      Clipboard.setString(blogContent[i].content)
                    }
                  >
                    <Text style={styles.blogContentCode}>
                      {blogContent[i].content}
                    </Text>
                    <Text>Long Click to Copy</Text>
                  </TouchableOpacity>
                </View>
              );
            }
          }
          return blogDivs;
        })()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    // fontWeight: "bold",
    marginBottom: 12,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  blogContentView: {
    marginBottom: 10,
    width: "100%",
    // padding: 10,
    alignContent: "flex-start",
  },
  blogContentCode: {
    width: "100%",
    backgroundColor: "black",
    color: "white",
    // padding: "2.25rm, 0.25rem 1.5rem 0.75rem",
    borderRadius: 10,
    textAlign: "left",
    overflow: "visible",
  },
});
