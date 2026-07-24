import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    ActivityIndicator,
} from "react-native";
import axios from "axios";

const API_URL = "https://sandanibasha.tech/testapi.php";

const ListItem = React.memo(
    ({ title, content, navigation }) => (
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
    const [loadMore, setLoadMore] = useState(50);
    const [searchText, setSearchText] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);

    const clearSearch = () => {
        setSearchText("");
    };

    const fetchData = () => {
        axios
            .get(API_URL, {
                params: {
                    offset: data.length,
                    limit: loadMore,
                    search: searchText,
                },
            })
            .then((response) => {
                const sortedData = response.data;

                setData([...data, ...sortedData]);
                setOriginalData([...data, ...sortedData]);
                setLoading(false);
                setLoadingMore(false);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
                setLoading(false);
                setLoadingMore(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [loadMore, searchText]);

    const loadMoreData = () => {
        if (searchText === "") {
            setLoadMore(loadMore + 50);
        }
    };

    const onEndReached = () => {
        if (!loadingMore && searchText === "") {
            setLoadingMore(true);
            loadMoreData();
            fetchData();
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        setLoadMore(50);
        setData([]);
    };

    const renderItem = ({ item }) => (
        <ListItem
            title={item.Title}
            content={item.lyrics}
            navigation={navigation}
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
                        placeholder="Search..."
                        onChangeText={handleSearch}
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
                        keyExtractor={(_, index) => index.toString()}
                        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#cc0249" /> : null}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
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
