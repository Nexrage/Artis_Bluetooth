# Artis Bluetooth Demo
An IOS example project; designed to showcase interactions between react native and the in-store cash drawers. 
To demo, this application will need to be compiled on an ACTUAL device because of the bluetooth support.  


## Project Installation
Reminder: install your node dependencies
```
$ yarn install
```

Reminder: install your pod dependencies 
```
$ cd ios 
$ pod install
```


## Project Setup
edit your Info.plist in xcode
```
$ xed ios 
```

Add the Following 3 Properties and KeyValue pairings: 
```
Privacy - Bluetooth Always Usage Description
Description -> Bluetooth is required to connect to your stores printer/registers drawers
```

```
Privacy - Bluetooth Peripheral Usage Description
Description -> Bluetooth is required to connect to your stores printer/registers drawers
```

```
Supported external accessory protocols
item 0: -> jp.star-m.starpro
```

Add the following bridge header
```
Objective-C Bridging Header = BLUEAccessories.h
```
