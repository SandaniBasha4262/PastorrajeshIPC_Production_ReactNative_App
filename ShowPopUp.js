import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_DOMAIN,ShowModelWithoutTime}from "./apiConfig";
export default function ShowPopup() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const api_url = API_DOMAIN+'/AppSplashApi.php';
    console.log(api_url);
    useEffect(() => {
        AsyncStorage.getItem('lastPopupDisplayDate').then(lastDisplayDate => {
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
            //const currentDate = '2024-02-12';
            console.log(currentDate);
            if (!lastDisplayDate || lastDisplayDate !== currentDate) {
            //if (ShowModelWithoutTime) {
                fetch(api_url)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.length > 0 && data[0].image && data[0].is_active === 'Y') {
                            const imageUri = data[0].image;
                            setImageUrl(imageUri);
                            prefetchImageDimensions(imageUri, setImageDimensions);
                            setIsModalVisible(true);
                        } else {
                            setIsModalVisible(false); // Set modal visibility to false if is_active is not 'Y'
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                        setIsModalVisible(false); // Set modal visibility to false on error
                    })
            }});
    }, []);

    const handleClose = () => {
        setIsModalVisible(false);
       // AsyncStorage.setItem('laastPopupDisplayDate', new Date('2024-02-12').toISOString().split('T')[0]); // Store current date
        AsyncStorage.setItem('lastPopupDisplayDate', new Date().toISOString().split('T')[0]); // Store current date

    };


    const maxCardWidth = Math.min(screenWidth - 32, 520);
    const maxCardHeight = Math.min(screenHeight * 0.72, 560);

    const getImageStyle = () => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            return { width: maxCardWidth, height: maxCardHeight };
        }

        const aspectRatio = imageDimensions.width / imageDimensions.height;
        let width = maxCardWidth;
        let height = width / aspectRatio;

        if (height > maxCardHeight) {
            height = maxCardHeight;
            width = height * aspectRatio;
        }

        return { width, height };
    };

    const imageStyle = getImageStyle();
    const cardStyle = {
        width: imageStyle.width,
        height: imageStyle.height + 24,
    };

    return (
        <Modal isVisible={isModalVisible} style={styles.modalContainer} backdropOpacity={0.55}>
            <View style={styles.modalOverlay}>
                <View style={[styles.card, cardStyle]}>
                    <TouchableOpacity onPress={handleClose} activeOpacity={0.8} style={styles.closeButton} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
                        <FontAwesome
                            name="times"
                            size={22}
                            color="white"
                        />
                    </TouchableOpacity>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={[styles.image, imageStyle]} />
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                </View>
            </View>
        </Modal>
    );
}

function prefetchImageDimensions(uri, callback) {
    Image.getSize(uri, (width, height) => callback({ width, height }), () => callback({ width: 0, height: 0 }));
}

const styles = StyleSheet.create({
    modalContainer: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#121212',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 22,
        elevation: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        zIndex: 10,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        borderRadius: 16,
        backgroundColor: '#111',
    },
    placeholder: {
        width: '100%',
        height: 280,
        backgroundColor: '#1f1f1f',
    },
});


// Recommended image resolution
// For best results, use a source image with a clean aspect ratio and enough resolution for mobile:

// landscape: 1080 x 608 (16:9) or 1200 x 675
// portrait: 720 x 1080
// square: 1080 x 1080
// The modal will display up to about 520px wide and 560px tall on screen, so larger source images are fine — they just scale down cleanly.