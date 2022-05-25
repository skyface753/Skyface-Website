import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";
import apiService from "../services.js/ApiService";
import { ScrollView } from "react-native";
import BlogPreview from "../components/BlogPreview";

export default function SingleCategoryScreen({ route, navigation }) {
    const categoryFromCategories = route.params.category;

    const [category, setCategory] = useState(null);
    const [blogs, setBlogs] = useState(null);

    useEffect(() => {
        apiService("blog-categories/" + categoryFromCategories.url).then((response) => {
            setCategory(response.data["category"]);
            setBlogs(response.data["blogs"]);
        });
    }, []);

    if (!category || !blogs) return <ActivityIndicator />;
    console.log(category);
    console.log(blogs)
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.categoryDiv}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            <View style={styles.blogDiv}>
                {(() => {
                    if(blogs.length == 0) {
                        return <Text style={styles.noBlogs}>No blogs</Text>
                    }
                    const blogDivs = [];
                    for (let i = 0; i < blogs.length; i++) {
                        blogDivs.push(
                            BlogPreview(blogs[i], navigation)
                        );
                    }
                    return blogDivs;
                } )()}
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "black",
    },
    categoryName: {
        color: "white",
    },
    categoryDescription: {
        color: "white",
    },
    noBlogs: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
    },
});