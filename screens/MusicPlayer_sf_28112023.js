import React, { useState, useEffect } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
import { FlatList } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";

const MusicPlayer = ({ navigation }) => {
    const [tracks, setTracks] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const scrollRef = React.useRef(null);

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
        fetchTracks();
        return () => {
            if (audioPlayer) {
                audioPlayer.unloadAsync();
            }
        };
    }, []);

    const fetchTracks = async () => {
        const airtableAPI =
            "https://api.airtable.com/v0/appTKUoj0LngWXz5U/Music?view=Grid%20view";
        const headers = {
            Authorization: "Bearer keyYOO6faAvGhHeTh",
        };

        try {
            let response = await fetch(airtableAPI, { headers });
            let data = await response.json();
            setTracks(data.records);
            setIsLoading(false);
            if (data.records.length > 0) {
                playTrack(data.records[0], 0);
            }
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

        const audio_url = track.fields.audio_url;
        const newAudioPlayer = new Audio.Sound();

        try {
            await newAudioPlayer.loadAsync({ uri: audio_url });
            await newAudioPlayer.playAsync();
            const status = await newAudioPlayer.getStatusAsync();
            newAudioPlayer.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                }
            });
            setAudioPlayer(newAudioPlayer);
            setIsPlaying(true);
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

    return (
        <ImageBackground
            source={require("../assets/Glory_ministres.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6e60e6" />
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={tracks}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
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
                                            {item.fields.tittle}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.controls}>
                            <TouchableOpacity
                                style={styles.controlButton}
                                onPress={() => playTrack(tracks[currentTrackIndex - 1], currentTrackIndex - 1)}
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
                                onPress={() => playTrack(tracks[currentTrackIndex + 1], currentTrackIndex + 1)}
                                disabled={currentTrackIndex === tracks.length - 1}
                            >
                                <Icon name="forward" size={30} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/*<View style={styles.seekBarContainer}>
                    <Slider
                        style={styles.seekBar}
                        value={duration === 0 ? 0 : position / duration}
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
                  </View>*/}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: Dimensions.get("window").width * 0.8,
        height: Dimensions.get("window").height * 0.05,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: "#fff",
        justifyContent: "center",
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

});


export default MusicPlayer;
