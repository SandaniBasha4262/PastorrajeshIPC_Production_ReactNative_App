import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Linking,
    ActivityIndicator,
} from "react-native";
import { API_DOMAIN } from '../apiConfig';

const API_URL = `${API_DOMAIN}/SocialLinksApi.php`;

const SocialCard = () => {
    const [socialMediaUrls, setSocialMediaUrls] = useState({});
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Fetch social media URLs from the API
        const fetchSocialMediaUrls = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                // Convert the array of objects to an object with Platform as the key
                const urls = data.reduce((acc, item) => {
                    acc[item.Platform] = item.social_links;
                    return acc;
                }, {});

                setSocialMediaUrls(urls);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error("Error fetching social media URLs:", error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchSocialMediaUrls();
    }, []);

    const getImageSource = (platform) => {
        switch (platform) {
            case "facebook":
                return require("../assets/social/facebook.png");
            case "location":
                return require("../assets/social/user-location.png");
            case "instagram":
                return require("../assets/social/instagram.png");
            case "youtube":
                return require("../assets/social/youtube.png");
            case "domain":
                return require("../assets/social/domain.png");
            case "donate":
                return require("../assets/social/helphand.png");
            default:
                return null;
        }
    };

    const handleLinkPress = (socialMedia) => {
        const url = socialMediaUrls[socialMedia];
        if (url) {
            Linking.openURL(url).catch((err) =>
                console.error("An error occurred: ", err)
            );
        }
    };

    return (
        <View style={styles.socialcard}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.buttonContainerSocial}>
                    {Object.keys(socialMediaUrls).map((platform) => (
                        <TouchableOpacity
                            key={platform}
                            style={styles.buttonSocial}
                            onPress={() => handleLinkPress(platform)}
                        >
                            <Image
                                source={getImageSource(platform)}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    socialcard: {
        backgroundColor: "white",
        height: 60,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    /*buttonContainerSocial: {
        flexDirection: "row",
        justifyContent: "space-between",
    },*/
    buttonContainerSocial: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around", // or "space-evenly"
    },
    /* buttonSocial: {
         backgroundColor: "white",
         width: 45,
         height: 50,
         borderRadius: 25,
         alignItems: "center",
         justifyContent: "center",
         margin: 5,
     },*/
    buttonSocial: {
        backgroundColor: "white",
        width: width * 0.1,  // Use a percentage of the screen width
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
    },
    /*icon: {
        width: 50,
        height: 50,
    },*/
    icon: {
        width: width * 0.12,  // Adjust the width based on the button size
        height: width * 0.10, // Adjust the height based on the button size
    },
});

export default SocialCard;
