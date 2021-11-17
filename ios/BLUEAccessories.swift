// CoreBluetooth.swift
// Created by Vercjames
import UIKit
import Foundation
import ExternalAccessory



@objc(RNCBluetooth)
class RNCBluetooth: NSObject {
  var CTRLAccessoryManager = EAAccessoryManager.shared()

  @objc
  func openAccessoryPicker() {
    CTRLAccessoryManager.showBluetoothAccessoryPicker(withNameFilter: nil) { (error) in
      print(error?.localizedDescription)
    }
  }

  @objc
  func listConnectedAccessories() {
    print(CTRLAccessoryManager.connectedAccessories)
  }
  
  @objc
  func returnAccessoryList(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let returnList: NSMutableArray = []
    let deviceList = CTRLAccessoryManager.connectedAccessories
    
    for device in deviceList {
      let returnDevice: NSMutableDictionary = [:]
      returnDevice["name"] = device.name
      returnDevice["connected"] = device.isConnected
      returnDevice["connectionID"] = device.connectionID
      returnDevice["serialNumber"] = device.serialNumber
      returnDevice["modelNumber"] = device.modelNumber
      returnList.add(returnDevice)
    }
    resolve(returnList)
  }
  
  
  @objc
  func disconnectFromAccessory(_ modelName: String, portNames: String, portSettings: String, timeout: UInt32, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    var port: SMPort
//    port = try SMPort.getPort(portName: portName, portSettings: portSettings, ioTimeoutMillis: 10000)
    print(modelName)
    print(portName)
    print(portSettings)
    print(timeout)
    
    
    port = try SMPort.getPort(portName: portName, portSettings: portSettings, ioTimeoutMillis: timeout)
    print("PORT: =============================")
    print(port)

  }
  
  
  @objc
  func returnExampleCallback(_ callback: RCTResponseSenderBlock) {
    callback(["Example Callback"])
  }
}
