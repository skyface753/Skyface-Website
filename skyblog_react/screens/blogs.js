import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import axios from "axios";
import { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { BACKENDURL } from "../constants";

export default function Blogs() {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.post(BACKENDURL + "blogs").then((res) => {
      setBlogs(res.data);
    });
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      {(() => {
        const blogDivs = [];
        for (let i = 0; i < blogs.length; i++) {
          blogDivs.push(
            <View key={blogs[i]._id} style={styles.blogDiv}>
              <TouchableOpacity
                key={blogs[i]._id}
                onPress={() => {
                  // Goto new screen
                  navigation.navigate("SingleBlog", {
                    blog: blogs[i],
                  });
                }}
              >
                <Text style={styles.blogTitle}>{blogs[i].title}</Text>
                <Text style={styles.blogContent}>{blogs[i].subtitle}</Text>
              </TouchableOpacity>
            </View>
          );
        }
        return blogDivs;
      })()}
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  scrollView: {
    margin: 30,
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  blogDiv: {
    margin: 10,
  },
  // blogDiv: {
  //   margin: 10,
  //   padding: 10,
  //   alignContent: "left",
  //   // alignItems: "left",
  //   width: "80%",
  // },
});
