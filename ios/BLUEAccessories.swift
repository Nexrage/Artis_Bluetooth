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
}
