import React from "react";
import { NativeBaseProvider, Button, Select, CheckIcon } from "native-base"
import {  SafeAreaView } from "react-native-safe-area-context";
import { Text, View, NativeModules } from "react-native";
// import { CommandsArray, Printer, StarPRNT } from "react-native-star-prnt";

export const Primary = () => {
  let [activeDevice, setActiveDevice] = React.useState("")
  let [devices, setDevices] = React.useState([])
  React.useEffect(() => {
    (async () => {
    })()
  }, [])

  const openAccessoryPicker = () => {
    NativeModules.RNCBluetooth.openAccessoryPicker()
  }

  const listConnectedAccessories = async () => {
    let deviceList = await NativeModules.RNCBluetooth.returnAccessoryList()
    setDevices(deviceList)
  }

  const disconnectFromAccessory = async () => {
    let logging = await NativeModules.RNCBluetooth.disconnectFromAccessory("POP10 WHT", "BT:mPOP-1", "", 10000)
    console.log(logging)
  }

  const returnExampleCallback = async () => {
    NativeModules.RNCBluetooth.returnExampleCallback((result) => {
        console.log(result)
      },
    );
  }


// Otherwise, render the app as intended!
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 10 }}>
          <Text style={{ textAlign: "center", marginBottom: 15, fontSize: 20 }}>Nexrage Bluetooth Demo</Text>
          <Button onPress={() => openAccessoryPicker()} marginX={3} marginY={1}>Open Picker</Button>
          <Button onPress={() => listConnectedAccessories()} marginX={3} marginY={1}>Load Selector</Button>
          <Button onPress={() => disconnectFromAccessory()} marginX={3} marginY={1}>Disconnect Event</Button>
          {/*<Button onPress={() => returnExampleCallback()} marginX={3} marginY={1}>Example CB</Button>*/}

          {/*  <Select selectedValue={activeDevice}*/}
          {/*    mt={1}*/}
          {/*    height="50"*/}
          {/*    minWidth="200"*/}
          {/*    accessibilityLabel="Select Accessory"*/}
          {/*    placeholder="Select Accessory"*/}
          {/*    _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size="5" /> }}*/}
          {/*    onValueChange={(itemValue) => connectDevice(itemValue)}*/}
          {/*  >*/}
          {/*    {devices.map((device) =>*/}
          {/*      <Select.Item key={device.connectionID} label={device.name} value={device} />,*/}
          {/*    )}*/}
          {/*  </Select>*/}

          {/*  <View style={{ borderBottomColor: "black", borderBottomWidth: 1, marginTop: 25, marginBottom: 25 }} />*/}

          {/*  { activeDevice === "" ? (*/}
          {/*    <View>*/}
          {/*      <Text style={{ textAlign: "center" }}>Please Select A Device</Text>*/}
          {/*    </View>*/}
          {/*  ) : (*/}
          {/*    <View>*/}
          {/*      <Text style={{ textAlign: "center", marginBottom: 20 }}>{activeDevice.name}</Text>*/}
          {/*      <Button style={{ marginBottom: 20 }} onPress={() => testPrint()} marginX={3} marginY={1}>Test Print</Button>*/}
          {/*      <Button style={{ marginBottom: 20 }} onPress={() => openDrawer()} marginX={3} marginY={1}>Open Drawer</Button>*/}
          {/*    </View>*/}
          {/*  )}*/}
        </View>
      </SafeAreaView>
    </NativeBaseProvider>
  )
}
