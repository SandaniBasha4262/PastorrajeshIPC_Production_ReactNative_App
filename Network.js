// NetworkUtils.js

import * as Network from "expo-network";

export const checkInternetConnection = async () => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    const airmode = await Network.isAirplaneModeEnabledAsync();
    const ip = await Network.getIpAddressAsync();

    return {
      isConnected: networkState.isConnected,
      ipAddress: ip,
    };
  } catch (error) {
    console.error("Error fetching network state:", error);
    return {
      isConnected: false,
      ipAddress: null,
    };
  }
};
