import React,{ useEffect, useState } from 'react';
import { View, StyleSheet, Image,Linking } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const buttonsData = [
    { image: require('../assets/bible.jpg'), title: 'Bible' },
    { image: require('../assets/Lyrics.png'), title: 'Lyrics' },
    { image: require('../assets/Audio.png'), title: 'Audio' },
    { image: require('../assets/Dictionary.png'), title: 'Dictionary' },
    { image: require('../assets/liveimg.png'), title: 'Live' },
    { image: require('../assets/BOOKS.png'), title: 'Books' },
    { image: require('../assets/gallery.png'), title: 'Gallery' },
    { image: require('../assets/Pastorbtn.png'), title: 'Our Videos' },
    { image: require('../assets/prayer.png'), title: 'PrayerReq' },
];

const screenNames = [
    'BibleCategory',
    'Lyrics', // Replace with the actual screen name
    'Music', // Replace with the actual screen name
    'Dictionary', // Replace with the actual screen name
    'Live', // Replace with the actual screen name
    'Books', // Replace with the actual screen name
    'Gallery', // Replace with the actual screen name
    //'VideoCategory', // Replace with the actual screen name
    'PVideos', // Replace with the actual screen name
    'whatsapp', // Replace with the actual screen name
];

import { API_DOMAIN } from '../apiConfig';
// Custom API endpoint
const API_URL = API_DOMAIN+"/ButtonsApi.php";

const ButtonsPage = () => {
    const [buttonUrls, setButtonUrls] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const fetchButtonUrls = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                // Convert the array of objects to an object with Platform as the key
                const urls = data.reduce((acc, item) => {
                    acc[item.Platform] = item.button_links;
                    return acc;
                }, {});

                setButtonUrls(urls);
            } catch (error) {
                console.error('Error fetching button URLs:', error);
            }
        };

        fetchButtonUrls();
    }, []);

    const handleButtonPress = (screenName) => {
        try {
            if (screenName === 'Live' && buttonUrls.Live) {
                Linking.openURL(buttonUrls.Live);
            } else if (screenName === 'Gallery' && buttonUrls.Gallery) {
                Linking.openURL(buttonUrls.Gallery);
            } else if (screenName === 'whatsapp' && buttonUrls.whatsapp) {
                Linking.openURL(buttonUrls.whatsapp);
            } else if (screenName) {
                navigation.navigate(screenName);
            } else {
                console.error(`Screen not found: ${screenName}`);
            }
        } catch (error) {
            console.error(`Error navigating to screen: ${error}`);
        }
    };

    return (
        <View style={styles.btnContainer}>
            <View style={styles.row}>
                {buttonsData.slice(0, 3).map((button, index) => (
                    <Button
                        key={index}
                        title=""
                        buttonStyle={styles.button}
                        icon={
                            <View style={styles.buttonImageContainer}>
                                <Image source={button.image} style={styles.buttonImage} />
                                <Text style={styles.buttonText}>{button.title}</Text>
                            </View>
                        }
                        iconRight
                        containerStyle={styles.buttonContainer}
                        onPress={() => handleButtonPress(screenNames[index])}
                    />
                ))}
            </View>
            <View style={styles.row}>
                {buttonsData.slice(3, 6).map((button, index) => (
                    <Button
                        key={index + 3}
                        title=""
                        buttonStyle={styles.button}
                        icon={
                            <View style={styles.buttonImageContainer}>
                                <Image source={button.image} style={styles.buttonImage} />
                                <Text style={styles.buttonText}>{button.title}</Text>
                            </View>
                        }
                        iconRight
                        containerStyle={styles.buttonContainer}
                        onPress={() => handleButtonPress(screenNames[index + 3])}
                    />
                ))}
            </View>
            <View style={styles.row}>
                {buttonsData.slice(6, 9).map((button, index) => (
                    <Button
                        key={index + 6}
                        title=""
                        buttonStyle={styles.button}
                        icon={
                            <View style={styles.buttonImageContainer}>
                                <Image source={button.image} style={styles.buttonImage} />
                                <Text style={styles.buttonText}>{button.title}</Text>
                            </View>
                        }
                        iconRight
                        containerStyle={styles.buttonContainer}
                        onPress={() => handleButtonPress(screenNames[index + 6])}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    btnContainer: {
        flex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        margin: 10,
    },
    button: {
        borderRadius: 100,
        width: 100,
        height: 120, // Increased button height to fit the image and title
        backgroundColor: 'transparent', // Background color of the button
    },
    buttonImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonImage: {
        width: 88, // Adjust the image size as needed
        height: 88, // Adjust the image size as needed
    },
    buttonText: {
        color: '#fff', // Text color of the button
        marginTop: 5, // Spacing between image and title
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ButtonsPage;
