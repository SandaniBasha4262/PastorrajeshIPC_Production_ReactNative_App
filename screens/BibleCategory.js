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
// Custom API endpoint
const API_ENDPOINT = API_DOMAIN+"/BIbleRootApi.php";

const ListItem = React.memo(
    ({ bibles, navigation }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("BiblePages", { bibles })}
        >
            <Text style={styles.itemText}>{bibles}</Text>
        </TouchableOpacity>
    ),
    (prevProps, nextProps) => {
        return prevProps.bibles === nextProps.bibles;
    }
);

const BibleCategory = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]); // Store original data
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    const clearSearch = () => {
        setSearchText("");
    };

    const fetchData = () => {
        setLoading(true);
        axios
            .get(API_ENDPOINT)
            .then((response) => {
                // Assuming the response structure is similar to Airtable
                const sortedData = response.data.sort((a, b) => {
                    const orderA = parseInt(a.sorted_order_numbers, 10);
                    const orderB = parseInt(b.sorted_order_numbers, 10);

                    // Ensure that the sorting is numerical
                    if (!isNaN(orderA) && !isNaN(orderB)) {
                        return orderA - orderB;
                    }

                    // If sorting as numbers fails, try sorting as strings
                    return a.sorted_order_numbers.localeCompare(b.sorted_order_numbers);
                });
                setData(sortedData);
                setOriginalData(sortedData); // Store original data
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        // Fetch initial data
        fetchData();
    }, []);

    useEffect(() => {
        if (searchText === "") {
            // Reset data to original data when search text is empty
            setData(originalData);
        } else {
            // Filter data based on the search text
            const filteredData = originalData.filter((item) =>
                item.bibles.toLowerCase().includes(searchText.toLowerCase())
            );
            setData(filteredData);
        }
    }, [searchText]);

    const renderItem = ({ item }) => (
        <ListItem key={item.id} bibles={item.bibles} navigation={navigation} />
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

export default BibleCategory;
