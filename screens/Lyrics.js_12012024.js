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


//const API_URL = "https://sandanibasha.tech/testapi.php";

const API_URL = API_DOMAIN+"/LyricsAPI.php";

const ListItem = React.memo(
    ({ title, content, serial,navigation }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() =>
                navigation.navigate("LyricsView", { title, content })
            }
        >
            <Text style={styles.itemText}>{title}</Text>
        </TouchableOpacity>
    ),
    (prevProps, nextProps) => {
        return (
            prevProps.title === nextProps.title &&
            prevProps.content === nextProps.content
        );
    }
);

const Lyrics = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    //console.log(API_DOMAIN);
    const clearSearch = () => {
        setSearchText("");
    };

    useEffect(() => {
        const fetchData = () => {
            axios
                .get(API_URL, {
                    params: {
                        // Include any necessary parameters for your API request
                    },
                })
                .then((response) => {
                    const sortedData = response.data;

                    setData(sortedData);
                    setOriginalData(sortedData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data: ", error);
                    setLoading(false);
                });
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchText === "") {
            setData(originalData);
        } else {
            const filteredData = originalData.filter((item) =>
                item.Title.toLowerCase().includes(searchText.toLowerCase()) ||
                item.number.toString().includes(searchText)  // Check if number matches search text
            );
            setData(filteredData);
        }
    }, [searchText]);

    const renderItem = ({ item, index }) => (
        <ListItem
            title={`${item.Title} - ${item.number}`}
            content={item.lyrics}
            navigation={navigation}
            key={index.toString()} // Use index as the key
        />
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
                        placeholder="Search Number (or) Title"
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
                        keyExtractor={(item, index) => index.toString()} // Use index as the key
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

export default Lyrics;
