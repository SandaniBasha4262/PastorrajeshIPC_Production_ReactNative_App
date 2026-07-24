import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  BackHandler,
  ImageBackground,
  TextInput,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
import { FlatList } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";
import { API_DOMAIN } from '../apiConfig';

const PAGE_SIZE = 1000; // Number of tracks to load per page

/*class ListItem extends React.PureComponent {
  render() {
    const { item, index, playTrack, currentTrackIndex } = this.props;

    return (
        <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor:
                    index === currentTrackIndex ? "#6e60e6" : "white",
              },
            ]}
            onPress={() => playTrack(item, index)}
        >
          <View style={styles.cardContent}>
            <Text
                style={[
                  styles.cardText,
                  {
                    color:
                        index === currentTrackIndex ? "white" : "#6e60e6",
                  },
                ]}
            >
              {item.tittle}
            </Text>
          </View>
        </TouchableOpacity>
    );
  }
}*/

const ListItem = React.memo(({ item, index, playTrack, currentTrackIndex }) => {
  return (
      <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: index === currentTrackIndex ? "#6e60e6" : "white",
            },
          ]}
          onPress={() => playTrack(item, index)}
      >
        <View style={styles.cardContent}>
          <Text
              style={[
                styles.cardText,
                {
                  color: index === currentTrackIndex ? "white" : "#6e60e6",
                },
              ]}
          >
            {item.tittle}
          </Text>
        </View>
      </TouchableOpacity>
  );
});

const MusicPlayer = ({ navigation }) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [originalData, setOriginalData] = useState([]); // Store original data
  const [searchText, setSearchText] = useState("");
  const [playingSongTitle, setPlayingSongTitle] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const scrollRef = useRef(null);
  const flatListRef = useRef(null);
  const titleScrollAnim = useRef(new Animated.Value(0)).current;

  const startIndex = 1;
  const clearSearch = () => {
    setSearchText("");
    // Scroll to the first item in the filtered list
    flatListRef.current.scrollToIndex({
      animated: true,
      index: currentTrackIndex,
      viewOffset: 0,
      viewPosition: 0.5, // Adjust as needed
    });
  };

  const updatePlayingSongTitle = (title) => {
    setPlayingSongTitle(title);
  };

  useFocusEffect(
      React.useCallback(() => {
        const backAction = () => {
          setShowExitModal(true);
          return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => {
          backHandler.remove();
        };
      }, [])
  );

  useEffect(() => {
    configureAudio();
    fetchTracks();
    return () => {
      if (audioPlayer) {
        audioPlayer.unloadAsync();
      }
    };
  }, []);

  const configureAudio = async () => {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
  };

  useEffect(() => {
    if (searchText === "") {
      // Reset data to original data when search text is empty
      setTracks(originalData);
    } else {
      // Filter data based on the search text
      const filteredData = originalData.filter((item) =>
          item.tittle.toLowerCase().includes(searchText.toLowerCase())
      );
      setTracks(filteredData);

      // Scroll to the first item in the filtered list
      if (flatListRef.current && filteredData.length > 0) {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: 0,
          viewOffset: 0,
          viewPosition: 0.5,
        });
      }
    }
  }, [searchText]);

  const fetchTracks = async () => {
    const airtableAPI = API_DOMAIN + "/MusicApi.php";
    const headers = {};

    try {
      const response = await fetch(airtableAPI);
      const data = await response.json();
      const newTracks = data.slice(startIndex, startIndex + PAGE_SIZE);
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
      setOriginalData((prevTracks) => [...prevTracks, ...newTracks]); // Set original data
      setIsLoading(false);
      /* if (data.length > 0) {
        playTrack(data[0], 0);
      }*/
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const playTrack = async (track, index) => {
    setCurrentTrackIndex(index);
    if (audioPlayer) {
      try {
        await audioPlayer.unloadAsync();
      } catch (error) {
        console.error("Error unloading audioPlayer: ", error);
      }
    }

    const audio_url = track.audio_url;
    const newAudioPlayer = new Audio.Sound();

    try {
      await newAudioPlayer.loadAsync({ uri: audio_url });
      await newAudioPlayer.playAsync();
      const status = await newAudioPlayer.getStatusAsync();
      newAudioPlayer.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          updatePlayingSongTitle(""); // Clear the playing song title when playback finishes
        }
        else {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
          //console.log(position);
          //console.log(duration);
        }
      });
      setAudioPlayer(newAudioPlayer);
      setIsPlaying(true);
      updatePlayingSongTitle(track.tittle); // Set the playing song title
    } catch (error) {
      console.error("Error playing audio: ", error);
    }
  };

  const togglePlay = () => {
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pauseAsync();
      } else {
        audioPlayer.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (value) => {
    if (audioPlayer) {
      audioPlayer.setStatusAsync({
        positionMillis: value * duration,
      });
    }
  };

  const formatTime = (millis) => {
    if (isNaN(millis)) {
      return "00:00";
    }

    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const exitConfirmation = () => {
    setShowExitModal(true);
  };

  const handleExitConfirm = (confirmed) => {
    setShowExitModal(false);
    if (confirmed) {
      if (audioPlayer) {
        audioPlayer.unloadAsync();
      }
      navigation.goBack();
    }
  };

  const nextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      playTrack(tracks[currentTrackIndex + 1]);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      playTrack(tracks[currentTrackIndex - 1]);
    }
  };

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
              <TouchableOpacity
                  style={styles.clearSearch}
                  onPress={clearSearch}
              >
                <Text>✖️</Text>
              </TouchableOpacity>
          )}
          {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6e60e6" />
              </View>
          ) : tracks.length === 0 ? (
              <View style={styles.noRecordContainer}>
                <Text style={styles.noRecordText}>No Record Found</Text>
              </View>
          ) : (
              <>
                <FlatList
                    ref={flatListRef} // Set the FlatList reference
                    data={tracks}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <ListItem
                            item={item}
                            index={index}
                            playTrack={playTrack}
                            currentTrackIndex={currentTrackIndex}
                        />
                    )}
                />
                <View style={styles.controls}>
                  <TouchableOpacity
                      style={styles.controlButton}
                      onPress={() =>
                          playTrack(tracks[currentTrackIndex - 1], currentTrackIndex - 1)
                      }
                      disabled={currentTrackIndex === 0}
                  >
                    <Icon name="backward" size={30} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => togglePlay()}
                  >
                    <Icon
                        name={isPlaying ? "pause" : "play"}
                        size={30}
                        color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.controlButton}
                      onPress={() =>
                          playTrack(tracks[currentTrackIndex + 1], currentTrackIndex + 1)
                      }
                      disabled={currentTrackIndex === tracks.length - 1}
                  >
                    <Icon name="forward" size={30} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.seekBarContainer}>
                  <Slider
                      //style={{ width: 200, height: 40 }}
                      style={styles.seekBar}
                      value={(position ?? 0) / (duration || 1)}
                      //value={undefined}
                      minimumValue={0}
                      maximumValue={1}
                      step={0.01}
                      onValueChange={handleSliderChange}
                      thumbTintColor="#6e60e6"
                      minimumTrackTintColor="#6e60e6"
                      maximumTrackTintColor="#ccc"
                  />
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                  </View>
                </View>
              </>
          )}

          <Modal
              transparent={true}
              visible={showExitModal}
              animationType="fade"
              onRequestClose={() => setShowExitModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Do you want to exit?</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => handleExitConfirm(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => handleExitConfirm(true)}
                  >
                    <Text style={styles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6e60e6",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#6e60e6",
    justifyContent: "center",
    alignItems: "center",
  },
  seekBarContainer: {
    marginHorizontal: 20,
  },
  seekBar: {
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  timeText: {
    fontSize: 16,
    color: "#6e60e6",
  },
  exitButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    margin: 20,
  },
  exitButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginVertical: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#6e60e6",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
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
  playingSongTitle: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
  },
});

export default MusicPlayer;
