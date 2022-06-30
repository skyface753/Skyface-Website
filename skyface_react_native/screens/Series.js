import { Text, View, ScrollView } from "react-native"
import apiService from "../services.js/ApiService"
import { useState, useEffect } from "react"
import { ActivityIndicator } from "react-native"
import { StyleSheet } from "react-native"
export default function Series(){
    const [series, setSeries] = useState(null)
    const [seriesBlogs, setSeriesBlogs] = useState(null)

    useEffect(() => {
        apiService("series").then((response) => {
            if (response.data.success) {
                setSeries(response.data.series)
                console.log(response.data.series)
            } else {
                console.log(response.data)
            }
        })
    }, [])

    if(!series) return <ActivityIndicator />


    return(
        <ScrollView>
            {series.map((series) => {
                return(
                    <View key={series._id}>
                        <Text
                            style={styles.title}
                        >{series.name}</Text>
                        <Text
                            style={styles.description}
                        >{series.description}</Text>
                    </View>
                    
                )
            }
            )}
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    title: {
        color: "white",
    },
    description: {
        color: "white",
    }
})