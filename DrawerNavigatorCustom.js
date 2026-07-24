import {SafeAreaView} from "react-native-safe-area-context";
import React, { useEffect } from "react";
import {Image, Text, View,Animated,ScrollView } from "react-native";
import User from "./assets/pastorside.jpeg";
import {createDrawerNavigator, DrawerItemList,DrawerItem } from "@react-navigation/drawer";
import {FontAwesome, MaterialCommunityIcons,FontAwesome5, MaterialIcons, SimpleLineIcons} from "@expo/vector-icons";
import Home from "./screens/Home";
import Lyrics from "./screens/Lyrics";
import  BibleCategory from "./screens/BibleCategory";
import VideoCategory from "./screens/VideoCategory";
import DictionaryCategory from "./screens/DictionaryCategory";
import BooksCategory from "./screens/BooksCategory";
import MusicPlayer from "./screens/MusicPlayer";
import PastorVideos from "./screens/PastorVideos";
import CheckServerStatus from "./screens/CheckServerStatus";
import Swiper4 from "./screens/SwiperWithImages";
import CardList from "./screens/CardList";
import BookmarkedLyrics from "./screens/BookmarkedLyrics";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Drawer = createDrawerNavigator();
import { Share } from 'react-native';

export default function DrawerNavigatorCustom() {

// Function to share the app link
    const shareApp = async () => {
        try {
            await Share.share({
                message: 'Check out Pastor Rajesh IPC app on the Play Store: https://play.google.com/store/apps/details?id=com.Pastor_Rajesh_Ipc',
            });
        } catch (error) {
            console.error('Error sharing:', error.message);
        }
    };
    // Define a variable to conditionally render the CardList screen
    const showCardList = true; // Set to true or false based on your condition

    return (
/*
        <Drawer.Navigator useLegacyImplementation
*/
        <Drawer.Navigator useLegacyImplementation={false}
            drawerContent={
                (props) => {
                    return (
                        <ScrollView>
                        <SafeAreaView>
                            <View
                                style={{
                                    height: 200,
                                    width: '100%',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderBottomColor: "#f4f4f4",
                                    borderBottomWidth: 1
                                }}
                            >
                                <Image
                                    source={User}
                                    style={{
                                        height: 126,
                                        width: 220,
                                        //borderRadius: 65
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 22,
                                        marginVertical: 6,
                                        fontWeight: "bold",
                                        color: "#111"
                                    }}
                                >Pastor Rajesh</Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#111"
                                    }}
                                >IPC</Text>
                            </View>
                            <DrawerItemList {...props} />
                            <DrawerItem
                                label="Share App"
                                labelStyle={{ color: 'black' }}  // Set the label color to black
                                icon={() => <FontAwesome name="share" size={24} color="black" />}
                                onPress={shareApp}
                            />
                        </SafeAreaView>
                        </ScrollView>
                    )
                }
            }
            screenOptions={{
                drawerStyle: {
                    backgroundColor: "#fff",
                    width: 250
                },
                headerStyle: {
                    backgroundColor: "#C2185B",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold"
                },
                drawerLabelStyle: {
                    color: "#111"
                }
            }}
        >
            <Drawer.Screen
                name="Home"
                options={{
                    drawerLabel: "Home",
                    title: "Pastor Rajesh IPC",
                    drawerIcon: () => (
                        <FontAwesome5 name="church" size={24} color="black" />
                    )
                }}
                component={Home}
            />
            <Drawer.Screen
                name="BibleCategory"
                options={{
                    drawerLabel: "Bible",
                    title: "Bible",
                    drawerIcon: () => (
                        <FontAwesome name="book" size={20} color="black"/>
                    )
                }}
                component={BibleCategory}
            />
            <Drawer.Screen
                name="Lyrics"
                options={{
                    drawerLabel: "Lyrics",
                    title: "Lyrics",
                    drawerIcon: () => (
                        <FontAwesome name="music" size={20} color="black"/>
                    )
                }}
                component={Lyrics}
            />
            <Drawer.Screen
                name="Music"
                options={{
                    drawerLabel: "Music",
                    title: "Music",
                    drawerIcon: () => (
                        <MaterialIcons name="library-music" size={24} color="black" />
                    )
                }}
                component={MusicPlayer}
            />
            <Drawer.Screen
                name="Dictionary"
                options={{
                    drawerLabel: "Dictionary",
                    title: "Dictionary",
                    drawerIcon: () => (
                        <FontAwesome name="book" size={20} color="black"/>
                    )
                }}
                component={DictionaryCategory}
            />
            {/*<Drawer.Screen
                name="VideoCategory"
                options={{
                    drawerLabel: "Videos",
                    title: "Videos",
                    drawerIcon: () => (
                        <FontAwesome name="play-circle" size={20} color="black"/>
                    )
                }}
                component={VideoCategory}
            />*/}

            <Drawer.Screen
                name="Books"
                options={{
                    drawerLabel: "Books",
                    title: "Books",
                    drawerIcon: () => (
                        <FontAwesome name="book" size={20} color="black"/>
                    )
                }}
                component={BooksCategory}
            />
            <Drawer.Screen
                name="PVideos"
                options={{
                    drawerLabel: "Our Videos",
                    title: "Our Videos",
                    drawerIcon: () => (
                        <FontAwesome name="video-camera" size={24} color="black" />
                    )
                }}
                component={PastorVideos}
            />
            <Drawer.Screen
                name="LyricsFavorites"
                options={{
                    drawerLabel: "LyricsFavorites",
                    title: "LyricsFavorites",
                    drawerIcon: () => (
                        <MaterialIcons name="favorite" size={24} color="black" />
                    )
                }}
                component={BookmarkedLyrics}
            />

           {/* <Drawer.Screen
                name="CheckServer"
                options={{
                    drawerLabel: "CheckServer",
                    title: "CheckServer",
                    drawerIcon: () => (
                        <FontAwesome name="video-camera" size={24} color="black" />
                    )
                }}
                component={CheckServerStatus}
            />*/}
            {/* <Drawer.Screen
                name="Swiper"
                options={{
                    drawerLabel: "Swiper",
                    title: "Swiper",
                    drawerIcon: () => (
                        <FontAwesome name="video-camera" size={24} color="black" />
                    )
                }}
                component={Swiper4}
            />
           */}
        </Drawer.Navigator>);
}
