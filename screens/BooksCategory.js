import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Button,
    StyleSheet,
    Image,
    ActivityIndicator,
    Linking,
    TextInput,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_DOMAIN } from '../apiConfig';
const API_URL = API_DOMAIN+"/BooksApi.php";

class ListItem extends React.PureComponent {
    render() {
        const { item, onPress } = this.props;
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => onPress(item)}>
                <Image source={{ uri: item.Image }} style={styles.imageIcon} />
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.videoCategory}
                >
                    {item.Title}
                </Text>
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText} onPress={() => onPress(item)}>
                        Read
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }
}

function BooksCategory() {
    const [categories, setCategories] = useState([]);
    const [originalCategories, setOriginalCategories] = useState([]);
    const [loading, setLoading] = useState(true); // State to handle loading
    const [searchText, setSearchText] = useState("");
    const navigation = useNavigation(); // Initialize navigation

    const clearSearch = () => {
        setSearchText("");
        setCategories(originalCategories);
    };
    useEffect(() => {
        axios
            .get(API_URL)
            .then((response) => {
                const categoryData = response.data.map((record) => ({
                    id: record.id,
                    Title: record.Title,
                    Image: record.Image,
                    Book: record.Book,
                }));
                setCategories(categoryData);
                setOriginalCategories(categoryData);
                setLoading(false); // Turn off loading after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false); // Handle loading when there's an error
            });
    }, []);

    const handleNavigation = (item) => {
        Linking.openURL(item.Book);
    };

    const filterCategories = (text) => {
        setSearchText(text);
        if (text === "") {
            setCategories(originalCategories);
        } else {
            const filteredCategories = originalCategories.filter((category) =>
                category.Title.toLowerCase().includes(text.toLowerCase())
            );
            setCategories(filteredCategories);
        }
    };

    return (
        <View style={styles.screen}>
            <TextInput
                style={styles.searchBox}
                placeholder="Search..."
                onChangeText={filterCategories}
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
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ListItem key={item.id}  item={item} onPress={() => handleNavigation(item)} />
                    )}
                    // Add FlatList props for virtualization
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screen: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    listItem: {
        backgroundColor: "white",
        padding: 20,
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "black",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
    },
    imageIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    submitButton: {
        backgroundColor: "#cc0249",
        padding: 10,
        borderRadius: 20,
        marginRight: 5,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    videoCategory: {
        flex: 1,
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
    divider: {
        height: 1,
        backgroundColor: "white",
    },
    loadingIndicator: {
        marginTop: 20,
    },
    clearSearch: {
        position: 'absolute',
        right: 23,
        top: 30,
    },
});

export default BooksCategory;
