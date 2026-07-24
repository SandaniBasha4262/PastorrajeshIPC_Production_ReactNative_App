import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, View, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import {API_DOMAIN} from "../apiConfig";

const { width } = Dimensions.get('window');
const scrollViewWidth = width - 10;
const scrollViewHeight = 200;
const scrollInterval = 2000; // Set the auto-scroll interval in milliseconds

export default function SwiperWithImages() {
    const scrollValue = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [data, setData] = useState([]);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_DOMAIN+'/AppHomeSlider.php');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        const scrollIntervalId = setInterval(() => {
            // Calculate the next index to scroll to
            const nextIndex = (scrollIndex + 1) % data.length;
            setScrollIndex(nextIndex);
            scrollToIndex(nextIndex);
        }, scrollInterval);

        return () => clearInterval(scrollIntervalId);
    }, [scrollIndex, data]);

    const scrollToIndex = (index) => {
        const xOffset = index * width;
        scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
    };

    const handleImagePress = (url) => {
        Linking.openURL(url);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollValue } } }],
                    { useNativeDriver: false },
                )}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                {data.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => handleImagePress(item.links)}
                    >
                        <Image source={{ uri: item.images }} style={styles.image} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.indicatorContainer} pointerEvents="none">
                {data.map((_, i) => (
                    <Indicator key={i} i={i} scrollValue={scrollValue} />
                ))}
            </View>
        </View>
    );
}

function Indicator({ i, scrollValue }) {
    const translateX = scrollValue.interpolate({
        inputRange: [-width + i * width, i * width, width + i * width],
        outputRange: [-20, 0, 20],
    });

    return (
        <View style={styles.indicator}>
            <Animated.View style={[styles.activeIndicator, { transform: [{ translateX }] }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        width: scrollViewWidth,
        height: scrollViewHeight,
    },
    scrollViewContent: {
        flexDirection: 'row',

    },
    card: {
        width: scrollViewWidth,
        height: scrollViewHeight,
        borderRadius: 5,
        marginRight: 10,
        overflow: 'hidden',
        borderWidth: 4,  // Add border width
        borderColor: '#ffffff',  // Add border color (white)
        padding: 0,  // Adjust padding for the border
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        //borderRadius: 5,
    },
    indicatorContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 5,
        flexDirection: 'row',
    },
    indicator: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#C2185B',
        marginHorizontal: 5,
        overflow: 'hidden',
    },
    activeIndicator: {
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
        color:"#ffffff",
        borderRadius: 10,
    },
});
