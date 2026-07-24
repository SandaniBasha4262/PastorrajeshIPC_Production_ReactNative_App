import { Alert } from "react-native";

const handleNetworkAlert = (recheckConnection) => {
    Alert.alert(
        "Connection Error",
        "No Internet Connection",
        [
            {
                text: "Retry",
                onPress: () => recheckConnection(),
            },
        ],
        { cancelable: false }
    );
};

export default handleNetworkAlert;
