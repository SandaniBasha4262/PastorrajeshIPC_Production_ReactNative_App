import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { API_DOMAIN } from "../apiConfig";

//const API_URL = "https://sandanibasha.tech/testapi.php";

const CheckServerStatus = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [serverStatus, setServerStatus] = useState(null);

    useEffect(() => {
        // Fetch server status from the API
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        try {
            const response = await fetch(`${API_DOMAIN}/CheckAppStatus.php`);
            const data = await response.json();

            // Assuming the API response is an array with a single object
            const status = data.length > 0 ? data[0].Status : 'N';

            setServerStatus(status);

            // Show the modal based on the server status
            if (status === 'N') {
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error fetching server status:', error);
        }
    };

    const handleServerUp = () => {
        // Perform actions when the server status is up ('Y')
        setModalVisible(false);
        // Additional logic if needed when server is up
    };

    const handleServerDown = () => {
        // Perform actions when the server status is down ('N')
        setModalVisible(false);
        // Additional logic if needed when server is down
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/*<Text style={styles.statusText}>
                Server Status: {serverStatus ? serverStatus : 'Loading...'}
            </Text>*/}

            <Modal isVisible={isModalVisible} style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTextTitle}>Under Maintainance</Text>
                    <Text style={styles.modalText}>Sorry For the Inconvenience</Text>
                    <Text style={styles.modalText}>We will be back soon...</Text>
                   {/* <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => handleServerDown()}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.retryButton} onPress={() => handleServerUp()}>
                            <Text style={styles.buttonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>*/}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    statusText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        //width: 300, // Set a fixed width for the modal
        height: 200, // Set a fixed height for the modal
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '100%', // Ensure the content takes full width of the modal
        //height: '100%', // Ensure the content takes full height of the modal
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalTextTitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        textDecorationLine:'underline',
        fontWeight:'bold',
        color:'red',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    retryButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CheckServerStatus;
