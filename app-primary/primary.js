import React from "react";
import { NativeBaseProvider, Button  } from "native-base"
import {  SafeAreaView } from "react-native-safe-area-context";
import { Text, View, NativeModules } from "react-native";


export const Primary = () => {
  React.useEffect(() => {
    (async () => {
    })()
  }, [])

  const openAccessoryPicker = () => {
    NativeModules.RNCBluetooth.openAccessoryPicker()
  }

  const listConnectedAccessories = () => {
    NativeModules.RNCBluetooth.listConnectedAccessories()
  }

// Otherwise, render the app as intended!
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 10 }}>
          <Text>Nexrage Bluetooth Demo</Text>
          <Button onPress={() => openAccessoryPicker()} marginX={3} marginY={1}>Open Picker</Button>
          <Button onPress={() => listConnectedAccessories()} marginX={3} marginY={1}>list Accessories</Button>
        </View>
      </SafeAreaView>
    </NativeBaseProvider>
  )
}
