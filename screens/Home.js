import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import CardList from './CardList';
import ButtonsPage from './ButtonsPage';
import SocialCard from './SocialCard';
import Swiper4 from './SwiperWithImages';
import CheckServerStatus from "./CheckServerStatus";
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
    return (
        <ImageBackground
            source={require('../assets/ScreenBackground.jpg')}
            style={styles.backgroundImage}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {/*<CardList />*/}
                    <CheckServerStatus />
                    <Swiper4 />
                    <ButtonsPage />
                    <SocialCard />
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
