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
//const API_KEY = "keyYOO6faAvGhHeTh";

const ListItem = React.memo(
    ({ numbers, pages, table, navigation }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("BibleReading", { numbers, pages, table })}
        >
            <Text style={styles.itemText}>{numbers}</Text>
        </TouchableOpacity>
    ),
    (prevProps, nextProps) => {
        return (
            prevProps.numbers === nextProps.numbers &&
            prevProps.pages === nextProps.pages &&
            prevProps.table === nextProps.table
        );
    }
);

const BiblePages = ({ navigation }) => {
    const route = useRoute();
    const table = route.params.bibles;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    const clearSearch = () => {
        setSearchText("");
    };

    const TABLE_NAME = table;

    useEffect(() => {
        const fetchData = () => {
            axios
                .get(API_DOMAIN+`/BibleApi.php?bible=${TABLE_NAME}`)
                .then((response) => {
                    // Assuming the response data structure is similar to your previous API response
                    const sortedData = response.data.sort((a, b) => {
                        return a.numbers - b.numbers;
                    });

                    setData(sortedData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data: ", error);
                    setLoading(false);
                });
        };

        fetchData();
    }, [TABLE_NAME]);

    const renderItem = ({ item }) => (
        <ListItem key={item.id} numbers={item.numbers} pages={item.pages} table={table} navigation={navigation} />
    );

    const filteredData = data.filter((item) =>
        item.numbers.toString().includes(searchText)
    );

    return (
        <ImageBackground
            source={require("../assets/Glory_ministres.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.screen}>
                <TextInput
                    style={styles.searchBox}
                    placeholder="Search by numbers..."
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
        right: 23,
        top: 30,
    },
});

export default BiblePages;
