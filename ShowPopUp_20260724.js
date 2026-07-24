import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_DOMAIN,ShowModelWithoutTime} from "./apiConfig";
import activityIndicator from "react-native-paper/src/components/ActivityIndicator";
export default function ShowPopup() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const api_url = API_DOMAIN+'/AppSplashApi.php';
    console.log(api_url);
    useEffect(() => {
        AsyncStorage.getItem('lastPopupDisplayDate').then(lastDisplayDate => {
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
            //const currentDate = '2024-02-12';
            console.log(currentDate);
            //if (!lastDisplayDate || lastDisplayDate !== currentDate) {
            if (ShowModelWithoutTime) {
                fetch(api_url)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.length > 0 && data[0].image && data[0].is_active === 'Y') {
                            setImageUrl(data[0].image);
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


    return (
        <Modal isVisible={isModalVisible} style={styles.modalContainer} backdropOpacity={0.5}>
            <View style={styles.modal}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <FontAwesome
                        name="times-circle-o"
                        size={30}
                        color="white"
                        style={styles.closeIcon}
                    />
                </TouchableWithoutFeedback>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    modal: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        height: 'auto',
    },
    closeIcon: {
        position: 'absolute',
        top: -20,
        right: 2,
        zIndex: 999,
        borderRadius: 15,
        borderColor: 'black',
    },
    image: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height - 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
});
