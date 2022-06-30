import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import apiService from "../services.js/ApiService.js";
import { useNavigation } from "@react-navigation/native";

function parentSort(fullList) {
  var sortedList = [];
  for (var i = 0; i < fullList.length; i++) {
    if (fullList[i].parent_category == null) {
      var childs = getChilds(fullList[i]._id, fullList);
      if (childs) {
        fullList[i].children = childs;
      }
      sortedList.push(fullList[i]);
    }
  }
  return sortedList;
}

function getChilds(currItemId, fullList) {
  var returnList = [];
  for (var i = 0; i < fullList.length; i++) {
    if (fullList[i].parent_category === currItemId) {
      var childs = getChilds(fullList[i]._id, fullList);
      if (childs) {
        fullList[i].children = childs;
      }
      returnList.push(fullList[i]);
    }
  }
  if (returnList.length === 0) return null;
  return returnList;
}

function childsToReact(marginLeft, currList) {
  var returnReact = [];
  if (currList == null) return returnReact;
  for (var i = 0; i < currList.length; i++) {
    // var categoryUrl = currList[i].url;
    returnReact.push(
      <View key={currList[i]._id}>
        {categoryItem(currList[i], marginLeft)}
        {childsToReact(marginLeft + 20, currList[i].children)}
      </View>
    );
  }
  return returnReact;
}

export default function Categories() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    apiService("blog-categories").then((response) => {
      setCategories(parentSort(response.data));
    });
  }, []);

  if (!categories) return <ActivityIndicator />;

  console.log(categories);
  return (
    <ScrollView>
      {(() => {
        var returnReact = [];
        for (var i = 0; i < categories.length; i++) {
          // var currUrl = categories[i].url;
          returnReact.push(
            <View key={categories[i]._id} style={styles.categoryContainer}>
              {categoryItem(categories[i], 0)}
              {childsToReact(20, categories[i].children)}
            </View>
          );
        }
        return returnReact;
      })()}
    </ScrollView>
  );
}

function categoryItem(currCategory, marginLeft = 0) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("categoryUrl: " + currCategory.url);
        // navigation.navigate("Category", {
        //     category: categories[i].url
        // });
        navigation.navigate("SingleCategory", {
          category: currCategory,
        });
      }}
    >
      <Text
        // style={styles.categoryItem}
        style={{
          marginLeft: marginLeft,
          fontSize: 24,
          fontWeight: "bold",
          padding: 5,
          color: "white",
        }}
      >
        {currCategory.name}
      </Text>
      {/* {currCategory.name} - {currCategory.description}
                                </Text> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    fontSize: 20,
    padding: 10,
    color: "white",
  },
  categoryContainer: {
    backgroundColor: "black",
    color: "white",
  },
});
