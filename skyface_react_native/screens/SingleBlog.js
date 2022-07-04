import { Content } from "../content_models/Content.js";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import { ScrollView } from "react-native-gesture-handler";
import { showMessage, hideMessage } from "react-native-flash-message";
import apiService from "../services.js/ApiService.js";

export default function SingleBlog({ route, navigation }) {
  const blogFromBlogs = route.params.blog;

  const [blogContent, setBlogContent] = useState(null);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    apiService("blog/" + blogFromBlogs.url).then((response) => {
      setBlog(response.data["blog"]);
      var tempContent = response.data["blogContent"];
      var fhefheu = tempContent.map((content) => {
        return Content.fromJSON(content);
      });
      setBlogContent(fhefheu);
      console.log(fhefheu);
    });
  }, []);

  if (!blog) return <ActivityIndicator />;

  navigation.setOptions({
    title: blog.title,
  });
  if (!blogContent) return <ActivityIndicator />;

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.subtitle}>{blog.subtitle}</Text>
        <View style={styles.separator} />
        {blogContent.map((content) => {
          if (
            content.type === "text" ||
            content.type === "code" ||
            content.type === "image"
          ) {
            return content.showContent();
          }
        })}
        {/* {(() => {
          const blogDivs = [];
          console.log(blogContent);
          if (blogContent.length == 0) {
            return <Text style={styles.blogContent}>No content</Text>;
          }
          for (let i = 0; i < blogContent.length; i++) {
            if (blogContent[i].type == "text") {
              blogDivs.push(
                <View key={blogContent[i]._id} style={styles.blogContentView}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                    }}
                  >
                    {blogContent[i].content}
                  </Text>
                </View>
              );
            } else if (blogContent[i].type == "code") {
              blogDivs.push(
                <View
                  key={blogContent[i]._id}
                  style={styles.blogContentCodeView}
                >
                  <TouchableOpacity
                    onLongPress={() => {
                      Clipboard.setString(blogContent[i].content);
                      showMessage({
                        message: "Text copied",
                        type: "info",
                      });
                    }}
                    onPress={() =>
                      showMessage({
                        message: "Long Click to Copy",
                        type: "info",
                      })
                    }
                  >
                    <Text style={styles.blogContentCode}>
                      {blogContent[i].content}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
          }
          return blogDivs;
        })()} */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "black",
    // color: "white",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    // color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    // color: "white",
    // fontWeight: "bold",
    marginBottom: 12,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    // color: "#2e78b7",
  },
  blogContentView: {
    marginBottom: 10,
    width: "100%",
    // backgroundColor: "black",
    // color: "white",
    // padding: 10,
    alignContent: "flex-start",
  },
  blogContentCode: {
    width: "100%",
    // backgroundColor: "gray",
    color: "white",
    padding: "3%",
    // padding: "2.25rm, 0.25rem 1.5rem 0.75rem",
    // borderRadius: 10,
    textAlign: "left",
    overflow: "visible",
    fontSize: 16,
    borderColor: "white",
    borderStyle: "solid",
  },
  blogContentCodeView: {
    margin: "0.3%",
    marginBottom: "2%",
    width: "100%",
    backgroundColor: "gray",
    borderRadius: 10,
  },
});
