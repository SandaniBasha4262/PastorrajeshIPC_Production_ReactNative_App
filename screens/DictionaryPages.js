import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    TextInput,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { API_DOMAIN } from '../apiConfig';

const API_URL = API_DOMAIN+"/DictionaryApi.php";

const ListItem = React.memo(
    ({ Title, Content, navigation }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("DictionaryReading", { Title, Content })}
        >
            <Text style={styles.itemText}>{Title}</Text>
        </TouchableOpacity>
    ),
    (prevProps, nextProps) => {
        return (
            prevProps.Title === nextProps.Title &&
            prevProps.Content === nextProps.Content
        );
    }
);

const DictionaryPages = ({ navigation }) => {
    const route = useRoute();
    const table = route.params.Category;
    const base_id = route.params.Keys;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    const clearSearch = () => {
        setSearchText("");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}?alpha=${table}`);
                const sortedData = response.data.sort((a, b) => {
                    return a.Title.localeCompare(b.Title);
                });

                setData(sortedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [table]);

    const renderItem = ({ item }) => (
        <ListItem key={item.id} Title={item.Title} Content={item.Content} navigation={navigation} />
    );

    const filteredData = data.filter((item) =>
        item.Title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <ImageBackground
            source={require("../assets/Glory_ministres.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.screen}>
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
                {loading ? (
                    <ActivityIndicator size="large" color="#cc0249" style={styles.loadingIndicator} />
                ) : (
                    <FlatList
                        data={filteredData}
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
    searchBox: {
        padding: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        marginBottom: 10,
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
    clearSearch: {
        position: 'absolute',
        right: 20,
        top: 30,
    },
});

export default DictionaryPages;
