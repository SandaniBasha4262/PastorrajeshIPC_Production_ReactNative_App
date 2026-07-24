import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, Linking, Text, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';
import { API_DOMAIN } from '../apiConfig';

const API_URL = `${API_DOMAIN}/AppHomeSlider.php`;

const CardList = () => {
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();

        const autoScroll = () => {
            const nextIndex = (currentIndex - 1 + data.length) % data.length;
            setCurrentIndex(nextIndex);
            const xOffset = nextIndex * 310; // Adjust this value based on card width
            scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
        };

        // Set up a timer to auto-scroll every 2 seconds
        const scrollInterval = setInterval(autoScroll, 2000);

        return () => {
            clearInterval(scrollInterval);
        };
    }, [currentIndex, data]);

    const handleCardPress = (link) => {
        Linking.openURL(link);
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            contentContainerStyle={styles.container}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
        >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) : (
                data.map((record, index) => {
                    const { images, links } = record;
                    if (images && images.length > 0) {
                        const imageUrl = images;
                        return (
                            <View key={index} style={styles.cardContainer}>
                                <TouchableOpacity
                                    onPress={() => handleCardPress(links)}
                                >
                                    <Card containerStyle={styles.card}>
                                        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        );
                    } else {
                        return null;
                    }
                })
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    cardContainer: {
        marginLeft: 3,
        padding: 0,
    },
    card: {
        width: 310,
        height: 200,
        borderRadius: 10,
        alignItems: 'center',
    },
    cardImage: {
        height: 170,
        width: 280,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CardList;
