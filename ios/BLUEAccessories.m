// BLUEAccessories.m
// Created by Vercjames

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNCBluetooth, NSObject)
//OR - @interface RCT_EXTERN_REMAP_MODULE(YourDesiredModuleNameInJS, YourModule, NSObject)

RCT_EXTERN_METHOD(openAccessoryPicker)
RCT_EXTERN_METHOD(listConnectedAccessories)
RCT_EXTERN_METHOD(returnAccessoryList: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(returnExampleCallback: (RCTResponseSenderBlock)callback)

@end

