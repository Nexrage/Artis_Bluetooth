import React from "react";
import { NativeBaseProvider, Button  } from "native-base"
import {  SafeAreaView } from "react-native-safe-area-context";
import { Text, View, NativeModules } from "react-native";
import { CommandsArray, Printer, StarPRNT } from "react-native-star-prnt";

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

  const connectDrawer2 = async () => {
    let devices = await StarPRNT.portDiscovery("Bluetooth")
    console.log(`Devices: ${JSON.stringify(devices)}`)

    if(devices[0]) {
      let deviceStatus1 = await StarPRNT.checkStatus(devices[0].portName, StarPRNT.Emulation.StarLine)
      console.log(`Status 1: ${JSON.stringify(deviceStatus1)}`)
    }
    if(devices[1]) {
      let deviceStatus2 = await StarPRNT.checkStatus(devices[1].portName, StarPRNT.Emulation.StarLine)
      console.log(`Status 2: ${JSON.stringify(deviceStatus2)}`)
    }

    try {
      console.log("===========================")
      let connect = await StarPRNT.connect("BT:mPOP-2", StarPRNT.Emulation.StarLine, false);
      console.log(connect)
      let disconnect = await StarPRNT.disconnect()
      console.log(disconnect)
    } catch (e) {
      console.log(JSON.stringify(e.code))
      console.log(JSON.stringify(e.message))
      console.log(JSON.stringify(e.domain))
      console.log(JSON.stringify(e.userInfo))
      // console.log(JSON.stringify(e))
    }
    // try {


      // let commandsArray = [];
      // commandsArray.push({ appendInternational: StarPRNT.InternationalType.UK });
      // commandsArray.push({
      //   appendLogo:1,  //Logo number configured using Star Print utility
      //   logoSize:StarPRNT.LogoSize.Normal,
      // });
      // commandsArray.push({ appendAlignment: StarPRNT.AlignmentPosition.Center });
      // commandsArray.push({ append: "Star Clothing Boutique\n" });
      // commandsArray.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
      // console.log(StarPRNT.Emulation.StarLine)
      // const apples = await StarPRNT.checkStatus("BT:mPOP-2", StarPRNT.Emulation.StarLine)
      // console.log(apples)
      // try {
      //   const apples2 = await StarPRNT.print(StarPRNT.Emulation.StarLine, commandsArray, "BT:mPOP-2");
      //   console.log(apples2)
      // } catch (e) {
      //   console.log(e)
      // }
      // await StarPRNT.print(StarPRNT.Emulation.StarLine, commands, printer?.portName);
      // const connect = await StarPRNT.connect("BT:mPOP-2", StarPRNT.Emulation.StarLine, false);
      // const connect = await StarPRNT.connect(portName, emulatison, hasBarcodeReader);
      // console.log(connect); // Printer Connected!
    // } catch (e) {
    //   console.error(e);
    // }
  }

  // const connectDrawer2 = () => {
  //   console.log("drawer2")
  // }


// Otherwise, render the app as intended!
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 10 }}>
          <Text>Nexrage Bluetooth Demo</Text>
          <Button onPress={() => openAccessoryPicker()} marginX={3} marginY={1}>Open Picker</Button>
          <Button onPress={() => listConnectedAccessories()} marginX={3} marginY={1}>list Accessories</Button>
          {/*<Button onPress={() => connectDrawer1()} marginX={3} marginY={1}>C() Drawer 1</Button>*/}
          <Button onPress={() => connectDrawer2()} marginX={3} marginY={1}>C() Drawer 2</Button>
        </View>
      </SafeAreaView>
    </NativeBaseProvider>
  )
}
