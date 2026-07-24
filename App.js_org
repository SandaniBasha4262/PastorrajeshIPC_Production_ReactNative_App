import "react-native-gesture-handler";
import { useEffect,useState } from "react";
import {Alert} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerNavigatorCustom  from "./DrawerNavigatorCustom";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
//import { checkInternetConnection } from "./Network";
//import handleNetworkAlert from "./NetworkAlert"; // Import the handleNetworkAlert function

const Stack = createNativeStackNavigator();
import  LyricsView from "./screens/LyricsView";
import VideoCategory from "./screens/VideoCategory";
import VideoPlayer from "./screens/VideoPlayer";
import BiblePages from "./screens/BiblePages";
import BibleReading from "./screens/BibleReading";
import DictionaryPages from "./screens/DictionaryPages";
import DictionaryReading from "./screens/DictionaryReading";
import PastorVideoPlayer from "./screens/PastorVideoPlayer";
import BookmarkedLyricsView from "./screens/BookmarkedLyricsView";
import { AppProvider } from "./AppContext";

import useNetworkStatus from './useNetworkStatus';
import { showAlert } from './AlertUtils';

import ShowPopup from './ShowPopUp';

export default function App() {

  const isConnected = useNetworkStatus();

  useEffect(() => {
    if (!isConnected) {
      showAlert('Connection Error', 'No Internet Connection');
    }
  }, [isConnected]);

  return (

      <AppProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="MainDrawer"
            component={DrawerNavigatorCustom}
            options={{ headerShown: false }} // Hide the header for the main drawer
        />
        <Stack.Screen name="LyricsView" component={LyricsView}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}
        />

        <Stack.Screen name="VideoPlayer" component={VideoPlayer}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}

        />

        <Stack.Screen name="BiblePages" component={BiblePages}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}
        />

        <Stack.Screen name="BibleReading" component={BibleReading}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}
        />

        <Stack.Screen name="DictionaryPages" component={DictionaryPages}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}
        />

        <Stack.Screen name="DictionaryReading" component={DictionaryReading}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}
        />


        <Stack.Screen name="PVideoPlayer" component={PastorVideoPlayer}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}
        />
        <Stack.Screen name="LyricsFavoritesView" component={BookmarkedLyricsView}  options={{
          headerStyle: {
            backgroundColor: "#C2185B", // Set the header background color to pink
          },
          headerTitleStyle: {
            fontWeight: "bold",  // Make the header title text bold
            color: "white",    // Set the header title text color to white
          },
          headerTintColor: "white", // Set the header Back Button color to white
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
        <ShowPopup />
      </AppProvider>
  );
}
