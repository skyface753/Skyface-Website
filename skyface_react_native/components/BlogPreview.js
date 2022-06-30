import { View, Text } from "./Themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function BlogPreview(currBlog, navigation){
    return(
    <View key={currBlog._id} style={styles.blogDiv}>
              <TouchableOpacity
                key={currBlog._id}
                onPress={() => {
                  // Goto new screen
                  navigation.navigate("SingleBlog", {
                    blog: currBlog,
                  });
                }}
              >
                <Text style={styles.blogTitle}>{currBlog.title}</Text>
                <Text style={styles.blogSubtitle}>{currBlog.subtitle}</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
            </View>
    );
}

const styles = StyleSheet.create({
    blogTitle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      blogDiv: {
        margin: "1%",
      },
      separator: {
        color: "white",
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        marginVertical: 30,
        height: 1,
        width: "100%",
      },
      blogDiv: {
        margin: "1%",
      },
    });