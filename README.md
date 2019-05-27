# Tick Mobile (Only Android Version)

## Authors

* [Ata Gulalan](https://github.com/atagulalan)
* [Oguzhan Turker](https://github.com/oguzturker8)


Run emulator:
```
cd %ANDROID_HOME%/emulator && emulator -avd Nexus_5X_API_28 (or on your emulator)
```

Android clean build & run:
```
npm install
npm install -g react-native-cli
react-native link
cd android
./gradlew clean
cd ..
npm run android
```

Generating APK File:
```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
cd android/
./gradlew assembleDebug
cd app/build/outputs/apk/debug
explorer .
```
