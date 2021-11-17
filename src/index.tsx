import React from "react";
import { NativeBaseProvider, Button, Select, CheckIcon } from "native-base"
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, NativeModules } from "react-native";
import { StarPRNT } from "react-native-star-prnt";

export const Index = () => {
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
    console.log(deviceList)
    setDevices(deviceList)
  }

  const returnExampleCallback = async () => {
    NativeModules.RNCBluetooth.returnExampleCallback((result: any) => {
        console.log(result)
      },
    );
  }

  const connectDevice = async (itemValue: any) => {
    // if the connection is bad
    // {"coverOpen": true, "cutterError": false, "offline": false, "overTemp": false, "receiptPaperEmpty": false}

    // if the connection is correct
    // {"FirmwareVersion": "3.0", "ModelName": "POP10", "coverOpen": false, "cutterError": false, "offline": false, "overTemp": false, "receiptPaperEmpty": false}
    try {
      const status = await StarPRNT.checkStatus(`BT:${itemValue.name}`, StarPRNT.Emulation.StarLine)
      if (!status.ModelName) {
        console.log(status)
        const disconnect = await StarPRNT.disconnect()
        console.log(disconnect)
        throw { code: "Connection Broken, Thanks SDK..." }
      }

      console.log(status)
      const connection = await StarPRNT.connect(`BT:${itemValue.name}`, StarPRNT.Emulation.StarLine, false);
      console.log(connection)
      await setActiveDevice(itemValue)
    } catch (e) {
      console.log(JSON.stringify(e.code))
      await setActiveDevice("")
    }
  }


  const testPrint = async () => {
    let commandsArray = [];
    commandsArray.push({
      append:
        "Verc Print Test\n" +
        "===============\n" +
        "\n",
    });
    commandsArray.push({ appendCutPaper:StarPRNT.CutPaperAction.PartialCutWithFeed });
    try {
      await StarPRNT.print(StarPRNT.Emulation.StarLine, commandsArray)
    } catch (e) {
      console.log(JSON.stringify(e.message))
    }
  }

  const openDrawer = async () => {
    let commandsArray = [];
    commandsArray.push({ append: "text" })
    commandsArray.push({ openCashDrawer: 1 })
    try {
      await StarPRNT.print(StarPRNT.Emulation.StarLine, commandsArray)
    } catch (e) {
      console.log(JSON.stringify(e.message))
    }
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
          {/*<Button onPress={() => returnExampleCallback()} marginX={3} marginY={1}>Example CB</Button>*/}

          <Select selectedValue={activeDevice}
                  mt={1}
                  height="50"
                  minWidth="200"
                  accessibilityLabel="Select Accessory"
                  placeholder="Select Accessory"
                  _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size="5" /> }}
                  onValueChange={(itemValue) => connectDevice(itemValue)}
          >
            {devices.map((device) =>
              <Select.Item key={device.connectionID} label={device.name} value={device} />,
            )}
          </Select>

          <View style={{ borderBottomColor: "black", borderBottomWidth: 1, marginTop: 25, marginBottom: 25 }} />

          { activeDevice === "" ? (
            <View>
              <Text style={{ textAlign: "center" }}>Please Select A Device</Text>
            </View>
          ) : (
            <View>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>{activeDevice.name}</Text>
              <Button style={{ marginBottom: 20 }} onPress={() => testPrint()} marginX={3} marginY={1}>Test Print</Button>
              <Button style={{ marginBottom: 20 }} onPress={() => openDrawer()} marginX={3} marginY={1}>Open Drawer</Button>
            </View>
          )}
        </View>
      </SafeAreaView>
    </NativeBaseProvider>
  )
}
