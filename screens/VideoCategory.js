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
  TextInput
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_DOMAIN } from '../apiConfig';

const API_URL = API_DOMAIN+"/VideosRootApi.php";

class ListItem extends React.PureComponent {
  render() {
    const { item, onPress } = this.props;
    return (
        <TouchableOpacity style={styles.listItem} onPress={() => onPress(item)}>
          <Image source={{ uri: item.imagethumbnail }} style={styles.imageIcon} />
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.videoCategory}
          >
            {item.videocategory}
          </Text>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText} onPress={() => onPress(item)}>
              Watch
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
    );
  }
}

function VideoCategory() {
  const [categories, setCategories] = useState([]);
  const [originalData, setOriginalData] = useState([]); // Store original data
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  const clearSearch = () => {
    setSearchText("");
  };

  useEffect(() => {
    axios
        .get(API_URL)
        .then((response) => {
          const categoryData = response.data.map((record) => ({
            id: record.id,
            videocategory: record.videocategory,
            imagethumbnail: record.imagethumbnail,
          }));
          setCategories(categoryData);
          setOriginalData(categoryData); // Set original data
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
  }, []);

  useEffect(() => {
    if (searchText === "") {
      // Reset data to original data when search text is empty
      setCategories(originalData);
    } else {
      // Filter data based on the search text
      const filteredData = originalData.filter((item) =>
          item.videocategory.toLowerCase().includes(searchText.toLowerCase())
      );
      setCategories(filteredData);
    }
  }, [searchText]);

  const handleNavigation = (item) => {
    navigation.navigate("VideoPlayer", { videocategory: item.videocategory, imagethumbnail: item.imagethumbnail });
  };

  return (
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
        ) : categories.length === 0 ? (
            <View style={styles.noRecordContainer}>
              <Text style={styles.noRecordText}>No Record Found</Text>
            </View>
        ) : (
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ListItem key={item.id} item={item} onPress={() => handleNavigation(item)} />
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
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
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
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#cc0249",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
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
  clearSearch: {
    position: 'absolute',
    right: 20,
    top: 30,
  },
  noRecordContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noRecordText: {
    fontSize: 18,
    color: "#cc0249",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "white",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default VideoCategory;
