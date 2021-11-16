import React from 'react';
import { View, Text, Button, TextInput, Image, FlatList } from 'react-native';
import { InterfaceType, StarConnectionSettings, StarXpandCommand, StarDeviceDiscoveryManager, StarDeviceDiscoveryManagerFactory, StarPrinter } from 'react-native-star-io10';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import BleManager from "react-native-ble-manager"

class App extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      interfaceType: InterfaceType.Lan,
      identifier: '2576121030600041',
      imageBase64: '',
      lanIsEnabled: true,
      bluetoothIsEnabled: true,
      bluetoothLeIsEnabled: true,
      usbIsEnabled: true,
      printers: [],
    };
  }
  private _manager?: StarDeviceDiscoveryManager;

  private _onPressDiscoveryButton = async () => {
    this.setState({
      printers: [],
    });

    try {
      console.log("RAWR")
      await this._manager?.stopDiscovery();

      var interfaceTypes: Array<InterfaceType> = [];
      if (this.state.lanIsEnabled) {
        interfaceTypes.push(InterfaceType.Lan);
      }
      if (this.state.bluetoothIsEnabled) {
        interfaceTypes.push(InterfaceType.Bluetooth);
      }
      if (this.state.bluetoothLeIsEnabled) {
        interfaceTypes.push(InterfaceType.BluetoothLE);
      }
      if (this.state.usbIsEnabled) {
        interfaceTypes.push(InterfaceType.Usb);
      }

      this._manager = await StarDeviceDiscoveryManagerFactory.create(
        interfaceTypes,
      );
      this._manager.discoveryTime = 10000;

      this._manager.onPrinterFound = (printer: StarPrinter) => {
        const printers = this.state.printers;
        printers.push(printer);
        this.setState({
          printers: printers,
        });

        console.log(`Found printer: ${printer.connectionSettings.identifier}.`);
      };

      this._manager.onDiscoveryFinished = () => {
        console.log('Discovery finished.');
      };

      await this._manager.startDiscovery();
    } catch (error) {
      console.log(`Error: ${String(error)}`);
    }
  };

  private disconnectEvent = () => {
    BleManager.getDiscoveredPeripherals([]).then((peripheralsArray) => {
      // Success code
      console.log("Discovered peripherals: " + peripheralsArray.length);
    });
  }

  private _onPressPrintButton = async () => {
    var settings = new StarConnectionSettings();
    settings.interfaceType = this.state.interfaceType;
    settings.identifier = this.state.identifier;
    // settings.autoSwitchInterface = true;

    var printer = new StarPrinter(settings);

    try {
      var builder = new StarXpandCommand.StarXpandCommandBuilder();
      builder.addDocument(
        new StarXpandCommand.DocumentBuilder().addPrinter(
          new StarXpandCommand.PrinterBuilder()
            .styleInternationalCharacter(
              StarXpandCommand.Printer.InternationalCharacterType.Usa,
            )
            .styleCharacterSpace(0)
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .actionPrintText(
              'Star Clothing Boutique\n' +
              '123 Star Road\n' +
              'City, State 12345\n' +
              '\n',
            )
            .styleAlignment(StarXpandCommand.Printer.Alignment.Left)
            .actionPrintText(
              'Date:MM/DD/YYYY    Time:HH:MM PM\n' +
              '--------------------------------\n' +
              '\n',
            )
            .actionPrintText(
              'SKU         Description    Total\n' +
              '300678566   PLAIN T-SHIRT  10.99\n' +
              '300692003   BLACK DENIM    29.99\n' +
              '300651148   BLUE DENIM     29.99\n' +
              '300642980   STRIPED DRESS  49.99\n' +
              '300638471   BLACK BOOTS    35.99\n' +
              '\n' +
              'Subtotal                  156.95\n' +
              'Tax                         0.00\n' +
              '--------------------------------\n',
            )
            .actionPrintText('Total     ')
            .add(
              new StarXpandCommand.PrinterBuilder()
                .styleMagnification(
                  new StarXpandCommand.MagnificationParameter(2, 2),
                )
                .actionPrintText('   $156.95\n'),
            )
            .actionPrintText(
              '--------------------------------\n' +
              '\n' +
              'Charge\n' +
              '156.95\n' +
              'Visa XXXX-XXXX-XXXX-0123\n' +
              '\n',
            )
            .add(
              new StarXpandCommand.PrinterBuilder()
                .styleInvert(true)
                .actionPrintText('Refunds and Exchanges\n'),
            )
            .actionPrintText('Within ')
            .add(
              new StarXpandCommand.PrinterBuilder()
                .styleUnderLine(true)
                .actionPrintText('30 days'),
            )
            .actionPrintText(' with receipt\n')
            .actionPrintText('And tags attached\n' + '\n')
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .actionPrintBarcode(
              new StarXpandCommand.Printer.BarcodeParameter(
                '0123456',
                StarXpandCommand.Printer.BarcodeSymbology.Jan8,
              )
                .setBarDots(3)
                .setBarRatioLevel(
                  StarXpandCommand.Printer.BarcodeBarRatioLevel.Level0,
                )
                .setHeight(5)
                .setPrintHri(true),
            )
            .actionFeedLine(1)
            .actionPrintQRCode(
              new StarXpandCommand.Printer.QRCodeParameter('Hello World.\n')
                .setModel(StarXpandCommand.Printer.QRCodeModel.Model2)
                .setLevel(StarXpandCommand.Printer.QRCodeLevel.L)
                .setCellSize(8),
            )
            .actionCut(StarXpandCommand.Printer.CutType.Partial),
        ),
      );

      var commands = await builder.getCommands();

      await printer.open();
      await printer.print(commands);

      console.log('Success');
    } catch (error) {
      console.log(`Error: ${String(error)}`);
    } finally {
      await printer.close();
      await printer.dispose();
    }
  };



  render() {
    return (
      <View style={{flex: 1, backgroundColor: "white"}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 100}}>Interface</Text>
            <Picker
              style={{width: 200, marginLeft: 20, justifyContent: 'center'}}
              selectedValue={this.state.interfaceType}
              onValueChange={(value) => {
                this.setState({interfaceType: value});
              }}>
              <Picker.Item label="LAN" value={InterfaceType.Lan} />
              <Picker.Item label="Bluetooth" value={InterfaceType.Bluetooth} />
              <Picker.Item
                label="Bluetooth LE"
                value={InterfaceType.BluetoothLE}
              />
              <Picker.Item label="USB" value={InterfaceType.Usb} />
            </Picker>
          </View>
          <View style={{flexDirection: 'row', marginTop: 30}}>
            <Text style={{width: 100}}>Identifier</Text>
            <TextInput
              style={{width: 200, marginLeft: 20}}
              value={this.state.identifier}
              onChangeText={(value) => {
                this.setState({identifier: value});
              }}
            />
          </View>
          <View style={{width: 100, marginTop: 20}}>
            <Button title="Print" onPress={this._onPressPrintButton} />
          </View>






        <Text>Interface</Text>

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <CheckBox
            style={{marginLeft: 20}}
            value={this.state.lanIsEnabled}
            onValueChange={(newValue) => {
              this.setState({lanIsEnabled: newValue});
            }}
          />
          <Text style={{marginLeft: 20}}>LAN</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <CheckBox
            style={{marginLeft: 20}}
            value={this.state.bluetoothIsEnabled}
            onValueChange={(newValue) => {
              this.setState({bluetoothIsEnabled: newValue});
            }}
          />
          <Text style={{marginLeft: 20}}>Bluetooth</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <CheckBox
            style={{marginLeft: 20}}
            value={this.state.bluetoothLeIsEnabled}
            onValueChange={(newValue) => {
              this.setState({bluetoothLeIsEnabled: newValue});
            }}
          />
          <Text style={{marginLeft: 20}}>Bluetooth LE</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <CheckBox
            style={{marginLeft: 20}}
            value={this.state.usbIsEnabled}
            onValueChange={(newValue) => {
              this.setState({usbIsEnabled: newValue});
            }}
          />
          <Text style={{marginLeft: 20}}>USB</Text>
        </View>

        <View style={{width: 100, marginTop: 30}}>
          <Button title="Discovery" onPress={this._onPressDiscoveryButton} />
        </View>


        <View style={{width: 100, marginTop: 30}}>
          <Button title="Discovery" onPress={this.disconnectEvent} />
        </View>
        <FlatList
          style={{marginTop: 30}}
          data={this.state.printers}
          renderItem={({item}) => (
            <Text>
              {item.connectionSettings.interfaceType} :{' '}
              {item.connectionSettings.identifier}
            </Text>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

export default App;


// import React from "react";
// import { NativeBaseProvider, Button, Select, CheckIcon } from "native-base"
// import {  SafeAreaView } from "react-native-safe-area-context";
// import { Text, View, NativeModules } from "react-native";
// import { InterfaceType, StarDeviceDiscoveryManager, StarDeviceDiscoveryManagerFactory, StarPrinter, } from "react-native-star-io10";
//
// import { CommandsArray, Printer, StarPRNT } from "react-native-star-prnt";
//
// export const Primary = () => {
//   let [manager, setManager] = React.useState(StarDeviceDiscoveryManager)
//
//
//   // let [activeDevice, setActiveDevice] = React.useState("")
//   let [devices, setDevices] = React.useState([])
//   let [printers, setPrinters] = React.useState([])
//   React.useEffect(() => {
//     (async () => {
//     })()
//   }, [])
//
//   const startDiscovery = async () => {
//     console.log(manager)
//     // try {
//     //   // Specify your printer interface types.
//     //   let manager = await StarDeviceDiscoveryManagerFactory.create([
//     //     InterfaceType.Lan,
//     //     InterfaceType.Bluetooth,
//     //     InterfaceType.BluetoothLE,
//     //     InterfaceType.Usb
//     //   ]);
//     //
//     //   // Set discovery time. (option)
//     //   manager.discoveryTime = 10000;
//     //
//     //   // Callback for printer found.
//     //   manager.onPrinterFound = (printer: StarPrinter) => {
//     //     console.log(printer);
//     //   };
//     //
//     //   // Callback for discovery finished. (option)
//     //   manager.onDiscoveryFinished = () => {
//     //     console.log(`Discovery finished.`);
//     //   };
//     //
//     //   // Start discovery.
//     //   await manager.startDiscovery();
//     //
//     //   // Stop discovery.
//     //   // await manager.stopDiscovery()
//     // }
//     // catch(error) {
//     //   // Error.
//     //   console.log(error);
//     // }
//   }
//
//   // const startDiscovery = async () => {
//   //   let manager = await StarDeviceDiscoveryManagerFactory.create([
//   //     InterfaceType.Lan,
//   //     InterfaceType.Bluetooth,
//   //     InterfaceType.BluetoothLE,
//   //     InterfaceType.Usb
//   //   ]);
//   //
//   //   console.log(manager)
//   //   //
//   //   // let manager = await
//   //   // manager.discoveryTime = 1000
//   //   //
//   //   //
//   //   // manager.onPrinterFound = (printer: StarPrinter) => {
//   //   //   // @ts-ignore
//   //   //   setPrinters(printers => [...printers, printer]);
//   //   //   console.log(`Found printer: ${printer.connectionSettings.identifier}.`);
//   //   // };
//   // }
//
//   const logPrinters = async () => {
//     console.log(printers)
//   }
//
//   // const openAccessoryPicker = () => {
//   //   NativeModules.RNCBluetooth.openAccessoryPicker()
//   // }
//   //
//   // const listConnectedAccessories = async () => {
//   //   let deviceList = await NativeModules.RNCBluetooth.returnAccessoryList()
//   //   setDevices(deviceList)
//   // }
//   //
//   // const returnExampleCallback = async () => {
//   //   NativeModules.RNCBluetooth.returnExampleCallback((result) => {
//   //     console.log(result)
//   //     },
//   //   );
//   // }
//   //
//   // const connectDevice = async (itemValue) => {
//   //   // is a bad connection
//   //   // {"coverOpen": true, "cutterError": false, "offline": false, "overTemp": false, "receiptPaperEmpty": false}
//   //
//   //   // is the correct connection
//   //   // {"FirmwareVersion": "3.0", "ModelName": "POP10", "coverOpen": false, "cutterError": false, "offline": false, "overTemp": false, "receiptPaperEmpty": false}
//   //   try {
//   //     const status = await StarPRNT.checkStatus(`BT:${itemValue.name}`, StarPRNT.Emulation.StarLine)
//   //     if (!status.ModelName) {
//   //       console.log(status)
//   //       const disconnect = await StarPRNT.disconnect()
//   //       console.log(disconnect)
//   //       throw { code: "Connection Broken, Thanks SDK..." }
//   //     }
//   //
//   //     console.log(status)
//   //     const connection = await StarPRNT.connect(`BT:${itemValue.name}`, StarPRNT.Emulation.StarLine, false);
//   //     console.log(connection)
//   //     await setActiveDevice(itemValue)
//   //   } catch (e) {
//   //     console.log(JSON.stringify(e.code))
//   //     await setActiveDevice("")
//   //   }
//   // }
//   //
//   //
//   // const testPrint = async () => {
//   //   let commandsArray = [];
//   //   commandsArray.push({
//   //     append:
//   //       "Verc Print Test\n" +
//   //       "===============\n" +
//   //       "\n",
//   //   });
//   //   commandsArray.push({ appendCutPaper:StarPRNT.CutPaperAction.PartialCutWithFeed });
//   //   try {
//   //     await StarPRNT.print(StarPRNT.Emulation.StarLine, commandsArray)
//   //   } catch (e) {
//   //     console.log(JSON.stringify(e.message))
//   //   }
//   // }
//   //
//   // const openDrawer = async () => {
//   //   let commandsArray = [];
//   //   commandsArray.push({ append: "text" })
//   //   commandsArray.push({ openCashDrawer: 1 })
//   //   try {
//   //     await StarPRNT.print(StarPRNT.Emulation.StarLine, commandsArray)
//   //   } catch (e) {
//   //     console.log(JSON.stringify(e.message))
//   //   }
//   // }
//   //
//   //
//   //
//   //
//
//
// // Otherwise, render the app as intended!
// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//   return (
//     <NativeBaseProvider>
//       <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//         <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 10 }}>
//           <Text style={{ textAlign: "center", marginBottom: 15, fontSize: 20 }}>Nexrage Bluetooth Demo</Text>
//           <Button onPress={() => startDiscovery()} marginX={3} marginY={1}>start Discovery</Button>
//           <Button onPress={() => logPrinters()} marginX={3} marginY={1}>Log Printers</Button>
//           {/*<Button onPress={() => openAccessoryPicker()} marginX={3} marginY={1}>Open Picker</Button>*/}
//           {/*<Button onPress={() => listConnectedAccessories()} marginX={3} marginY={1}>Load Selector</Button>*/}
//           {/*<Button onPress={() => returnExampleCallback()} marginX={3} marginY={1}>Example CB</Button>*/}
//
//         {/*  <Select selectedValue={activeDevice}*/}
//         {/*    mt={1}*/}
//         {/*    height="50"*/}
//         {/*    minWidth="200"*/}
//         {/*    accessibilityLabel="Select Accessory"*/}
//         {/*    placeholder="Select Accessory"*/}
//         {/*    _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size="5" /> }}*/}
//         {/*    onValueChange={(itemValue) => connectDevice(itemValue)}*/}
//         {/*  >*/}
//         {/*    {devices.map((device) =>*/}
//         {/*      <Select.Item key={device.connectionID} label={device.name} value={device} />,*/}
//         {/*    )}*/}
//         {/*  </Select>*/}
//
//         {/*  <View style={{ borderBottomColor: "black", borderBottomWidth: 1, marginTop: 25, marginBottom: 25 }} />*/}
//
//         {/*  { activeDevice === "" ? (*/}
//         {/*    <View>*/}
//         {/*      <Text style={{ textAlign: "center" }}>Please Select A Device</Text>*/}
//         {/*    </View>*/}
//         {/*  ) : (*/}
//         {/*    <View>*/}
//         {/*      <Text style={{ textAlign: "center", marginBottom: 20 }}>{activeDevice.name}</Text>*/}
//         {/*      <Button style={{ marginBottom: 20 }} onPress={() => testPrint()} marginX={3} marginY={1}>Test Print</Button>*/}
//         {/*      <Button style={{ marginBottom: 20 }} onPress={() => openDrawer()} marginX={3} marginY={1}>Open Drawer</Button>*/}
//         {/*    </View>*/}
//         {/*  )}*/}
//         </View>
//       </SafeAreaView>
//     </NativeBaseProvider>
//   )
// }
