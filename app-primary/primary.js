import React from "react";
import { NativeBaseProvider, Button  } from "native-base"
import {  SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";


export const Primary = () => {
  React.useEffect(() => {
    (async () => {
    })()
  }, [])

// Otherwise, render the app as intended!
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 10 }}>
          <Text>Nexrage Bluetooth Demo</Text>
        </View>
      </SafeAreaView>
    </NativeBaseProvider>
  )
}
