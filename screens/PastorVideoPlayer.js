import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Button,
    StyleSheet,
    ActivityIndicator,
    Image, // Import Image component
    Linking, TextInput,
} from "react-native";
import axios from "axios";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRoute } from "@react-navigation/native";
import { API_DOMAIN } from '../apiConfig';

class ListItem extends React.PureComponent {
    render() {
        const { item, onPress, imageUri } = this.props;
        return (
            <TouchableOpacity
                style={styles.listItem}
               // onPress={() => onPress(item.videoLink)}
                onPress={() => onPress(item.VideoCode)}
            >
                <View style={styles.circleImageContainer}>
                    <Image
                        style={styles.circleImage}
                        source={{ uri: imageUri }}
                    />
                </View>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.videoName}>
                    {item.videoName}
                </Text>
                <TouchableOpacity style={styles.playButton}>
                    <Text
                        style={styles.playButtonText}
                       // onPress={() => onPress(item.videoLink)}
                        onPress={() => onPress(item.VideoCode)}
                    >
                        Play
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }
}

function PastorVideoPlayer() {
    const [videos, setVideos] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [showPlayer, setShowPlayer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState(""); // State for search
    const [originalData, setOriginalData] = useState([]); // Store original data
    const route = useRoute();
    const TABLE_NAME = route.params.videocategory;
    const Image = route.params.imagethumbnail;
    const API_URL = `${API_DOMAIN}/PastorVideoPlayer.php?table_name=${TABLE_NAME}`;

    const clearSearch = () => {
        setSearchText("");

    };

    useEffect(() => {
        axios
            .get(API_URL)
            .then((response) => {
                const videoData = response.data.map((record) => ({
                    id: record.id,
                    videoName: record.videotitle,
                    videoLink: record.videourl,
                    VideoCode : record.video_code,
                    imageUri: Image,
                }));
                setVideos(videoData);
                setOriginalData(videoData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const handleVideoPlay = (videoId) => {
        //Linking.openURL(videoId);
        setSelectedVideoId(videoId);
        setShowPlayer(true);
    };

    useEffect(() => {
        if (searchText === "") {
            setVideos(originalData);
        } else {
            const filteredData = originalData.filter((item) =>
                item.videoName.toLowerCase().includes(searchText.toLowerCase())
            );
            setVideos(filteredData);
        }
    }, [searchText]);

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
                <ActivityIndicator
                    size="large"
                    color="#cc0249"
                    style={styles.loadingIndicator}
                />
            ) : videos.length === 0 ? (
                <View style={styles.noRecordContainer}>
                    <Text style={styles.noRecordText}>No Record Found</Text>
                </View>
            ): (
                showPlayer && (
                    <View style={styles.videoContainer}>
                        <YoutubePlayer videoId={selectedVideoId} height={220} play />
                    </View>
                )
            )}
            <FlatList
                data={videos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ListItem
                        item={item}
                        onPress={handleVideoPlay}
                        imageUri={Image}
                    />
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
            />
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
    videoContainer: {
        height: 220,
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
    circleImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
        marginRight: 10,
    },
    circleImage: {
        width: "100%",
        height: "100%",
    },
    playButton: {
        backgroundColor: "#cc0249",
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    playButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    videoName: {
        flex: 1,
        color: "#cc0249",
        fontWeight: "bold",
    },
    loadingIndicator: {
        marginTop: 20,
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
});

export default PastorVideoPlayer;
