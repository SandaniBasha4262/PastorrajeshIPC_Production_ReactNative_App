import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, BackHandler, ScrollView } from "react-native";
import { FAB } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const BibleReading = ({ route }) => {
    const { numbers, pages,table } = route.params;
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Check if the screen is focused

    const [fontSize, setFontSize] = useState(16); // Initial font size

    const increaseFontSize = () => {
        setFontSize(fontSize + 2); // Increase font size
    };

    const decreaseFontSize = () => {
        setFontSize(fontSize - 2); // Decrease font size
    };

  /*  useEffect(() => {
        // Add a back handler to handle the system back button press when the screen is focused
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if (isFocused) {
                navigation.navigate("BibleCategory"); // Navigate to the "Lyrics" screen
                return true; // Return true to indicate that we've handled the back press
            }
            return false;
        });

        // Clean up the back handler when the component unmounts or when the screen is not focused
        return () => backHandler.remove();
    }, [navigation, isFocused]);*/

    return (
        <ImageBackground
            source={require("../assets/Glory_ministres.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.card}>
                <Text style={[styles.titleText, { fontSize: fontSize, textDecorationLine: 'underline' }]}>
                    {table+" - "+numbers}
                </Text>
                <ScrollView>
                    <View style={styles.cardContent}>
                        <Text style={[styles.contentText, { fontSize: fontSize }]}>
                            {pages}
                        </Text>
                    </View>
                </ScrollView>
            </View>

            {/* Floating Action Button (FAB) */}
            <FAB
                style={[styles.fab, { backgroundColor: "#cc0249", top: 530 }]}
                small
                icon="plus"
                color="white"
                onPress={increaseFontSize}
            />
            <FAB
                style={[styles.fab, { backgroundColor: "#cc0249", top: 580 }]}
                small
                icon="minus"
                color="white"
                onPress={decreaseFontSize}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    card: {
        backgroundColor: "transparent",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "gray",
        margin: 16,
    },
    cardContent: {},
    titleText: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 8,
    },
    contentText: {
        fontSize: 16,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        color: "white",
        shadowColor: "#FFB6C1",
        shadowOpacity: 100,
        elevation: 5,
    },
});

export default BibleReading;
