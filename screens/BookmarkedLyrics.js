import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { AppContext } from "../AppContext";

const BookmarkedLyrics = ({ navigation }) => {
  const { bookmarks,removeBookmark } = useContext(AppContext);

  const renderItem = ({ item, index }) => (
      <TouchableOpacity
          style={styles.item}
          onPress={() =>
              navigation.navigate("LyricsFavoritesView", {
                title: item.title,
                content: item.content,
                serial: item.serial,
              })
          }
          onLongPress={() => handleLongPress(item)}
      >
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
  );


  const handleLongPress = (item) => {
    Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            onPress: () => removeBookmark(item.title), // Call your removeBookmark function
          },
        ],
        { cancelable: true }
    );
  };

  const renderEmptyList = () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Favorites found.</Text>
      </View>
  );

  return (
      <ImageBackground
          source={require("../assets/Glory_ministres.png")}
          style={styles.backgroundImage}
      >
        <View style={styles.marqueeContainer}>
          <Text style={styles.marqueeText} numberOfLines={1}>
            Long press to remove Lyrics from Favorites
          </Text>
        </View>
        <View style={styles.screen}>
          <FlatList
              data={bookmarks}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={renderEmptyList}
          />
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //backgroundColor: "white",
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#cc0249",
    fontWeight: "bold",
    fontSize:20,
  },
  marqueeContainer: {
    backgroundColor: "#cc0249",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  marqueeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BookmarkedLyrics;
