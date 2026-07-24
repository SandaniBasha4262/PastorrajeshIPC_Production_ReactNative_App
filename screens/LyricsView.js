import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  Button,
  Share
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import ExpandableFloatingAction from "react-native-expandable-fab";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { AppContext } from "../AppContext";
import {API_DOMAIN} from "../apiConfig";

const LyricsView = ({ route }) => {
  const { title, content,serial } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { addBookmark, bookmarks } = useContext(AppContext);

  const [fontSize, setFontSize] = useState(16);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const [isTitleBookmarked, setTitleBookmarked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const increaseFontSize = () => {
    setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize(fontSize - 2);
  };

  const handleShare = async (text) => {
    try {
      await Share.share({
        message: `${API_DOMAIN}${"/ReadLyric.php?id="}${serial}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Check if the title is already bookmarked
  const alreadyBookmarked = bookmarks.some(
    (bookmark) => bookmark.title === title
  );

  useEffect(() => {
    setTitleBookmarked(alreadyBookmarked);
  }, [alreadyBookmarked]);

  const handleBookmarkPress = async () => {
    if (alreadyBookmarked) {
      setDialogContent({
        title: "Already Added In Favorites",
        description: "This Title is already in your Favorites.",
      });
    } else {
      // If not bookmarked, add it to bookmarks
      addBookmark(title, content,serial);
      setDialogContent({
        title: "Favorite Added",
        description: "This Title has been added to your Favorites.",
      });
    }

    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     () => {
  //       if (isFocused) {
  //         navigation.navigate("Lyrics");
  //         return true;
  //       }
  //       return false;
  //     }
  //   );

  //   return () => backHandler.remove();
  // }, [navigation, isFocused]);

  return (
    <ImageBackground
      source={require("../assets/Glory_ministres.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.card}>
        <Text
          style={[
            styles.titleText,
            { fontSize: fontSize, textDecorationLine: "underline" },
          ]}
        >
          {title}
        </Text>
        <ScrollView>
          <View style={styles.cardContent}>
            <Text style={[styles.contentText, { fontSize: fontSize }]}>
              {content}
            </Text>
          </View>
        </ScrollView>
      </View>

      <ExpandableFloatingAction
        mainColor="#cc0249"
        secondaryColor="#cc0249"
        closeIcon={<MaterialIcons name="close" size={24} color="white" />}
        openIcon={<MaterialIcons name="add" size={24} color="white" />}
        menuIcons={[
          {
            name: "share",
            icon: <FontAwesome name="share-square" size={24} color="white" />,
            callback: handleShare,
          },
          {
            name: "ZoomIn",
            icon: <FontAwesome name="search-plus" size={24} color="white" />,
            callback: increaseFontSize,
          },
          {
            name: "ZoomOut",
            icon: <FontAwesome name="search-minus" size={24} color="white" />,
            callback: decreaseFontSize,
          },
          {
            name: "Bookmark",
            icon: (
              <MaterialIcons
                name={alreadyBookmarked ? "favorite" : "favorite-border"}
                size={24}
                color="white"
              />
            ),
            callback: handleBookmarkPress,
          },
        ]}
      />

      <Modal isVisible={isDialogVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{dialogContent.title}</Text>
          <Text style={styles.modalDescription}>
            {dialogContent.description}
          </Text>
          <View style={styles.buttonContainer}>
            <Button onPress={handleDialogClose} title="Ok" color="#cc0249" />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  okButton: {
    textAlign: "center",
    fontSize: 30,
    color: "#007BFF", // You can change the color as needed
    marginVertical: 10,
  },
  card: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    margin: 16,
  },
  cardContent: {},
  titleText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    color: "#cc0249",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    fontSize: 16,
    color: "#cc0249",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%", // Set width to 100% to make it full width
    marginTop: 20, // Add margin as needed
  },
});

export default LyricsView;
