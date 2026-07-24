import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API_DOMAIN } from '../apiConfig';

// Custom API URL
const CUSTOM_API_URL = API_DOMAIN+"/DictionaryRoot.php";

const ListItem = React.memo(
    ({ Category, Keys, navigation }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("DictionaryPages", { Category, Keys })}
        >
            <Text style={styles.itemText}>{Category}</Text>
        </TouchableOpacity>
    ),
    (prevProps, nextProps) => {
        return prevProps.Category === nextProps.Category && prevProps.Keys === nextProps.Keys;
    }
);

const DictionaryCategory = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]); // Store original data
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    const clearSearch = () => {
        setSearchText("");
        // Reset data to original data when clearing search
        setData(originalData);
    };

    useEffect(() => {
        // Fetch data from the custom API
        axios
            .get(CUSTOM_API_URL)
            .then((response) => {
                // Assuming the response is an array of objects with fields like 'Category' and 'Keys'
                const sortedData = response.data.sort((a, b) => {
                    return a.Category.localeCompare(b.Category);
                });

                setData(sortedData);
                setOriginalData(sortedData); // Store original data
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Filter the data based on search text
        if (searchText) {
            const filteredData = originalData.filter((item) =>
                item.Category.toLowerCase().includes(searchText.toLowerCase())
            );
            setData(filteredData);
        } else {
            // If the search text is empty, show the original data
            setData(originalData);
        }
    }, [searchText, originalData]);

    const renderItem = ({ item,index }) => (
        <ListItem key={item.id} Category={item.Category} Keys={item.Keys} navigation={navigation} />
    );

    return (
        <ImageBackground
            source={require("../assets/Glory_ministres.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.screen}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBox}
                        placeholder="Search..."
                        onChangeText={(text) => setSearchText(text)}
                        value={searchText}
                    />
                    {searchText !== "" && (
                        <TouchableOpacity style={styles.clearSearch} onPress={clearSearch}>
                            <Text>✖️</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#cc0249" style={styles.loadingIndicator} />
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    searchBox: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
    },
    clearSearch: {
        position: 'absolute',
        right: 20,
        top: 15,
    },
    item: {
        backgroundColor: "white",
        padding: 20,
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "black",
    },
    itemText: {
        color: "#cc0249",
        fontWeight: "bold",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default DictionaryCategory;
