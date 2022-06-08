_English | [Chinese](./README.zh.md)_

# Huanxin IM React-Native Description

Update time: 2022-05-10

This SDK is based on React Native and Chat SDK implementations for Android and iOS.

## directory description

├── CHANGELOG.md // Release notes document  
├── CONTRIBUTING.md // Contributor documentation  
├── LICENSE // License file  
├── README.md // Project help documentation  
├── README.zh.md // Project help documentation (Chinese version)  
├── android // react native SDK android platform folder  
├── docs // docs folder  
├── example // project built-in demo  
├── examples // Independent demo outside the project  
├── ios // react native SDK ios platform folder  
├── lib // react native SDK generates product folder  
├── native_src // react native SDK native source code folder  
├── node_modules // react native depends folder, generated by `yarn` or `npm` command  
├── package.json // react native project management file  
├── react-native-chat-sdk.podspec // react native ios cocoapods configuration file, used by ios platform.  
├── scripts // react native script folder  
├── src // react native source code folder  
├── tsconfig.build.json // typescript language build configuration file  
├── tsconfig.json // typescript language configuration file  
└── yarn.lock // yarn project dependency version configuration file

## project preparation

Download using git command

```bash
git clone --recurse-submodules git@github.com:easemob/react-native-chat-sdk.git
```

## Compile and run conditions

See here for specific requirements. [Portal](./docs/quick-start.md)

## project compilation

Open a terminal and run `yarn` or `yarn install` command

## build ios platform

- use `xcode` to open the file `example/ios/ChatSdkExample.xcworkspace`;
- Connect an ios device, or choose an emulator;
- Set the signature (if it is a real machine);
- Execute build, install and run demo.
- **Note** The `pod install` command has been executed when running the `yarn` command, otherwise, it needs to be run manually.

## build android platform

- use `android studio` to open the folder `example/android`;
- If it is the first time, please run the `sync` command first;
- Execute build, install and run demo;
- Before running the demo, start the service: `cd example && yarn start`.
- **Note** Make sure to execute the following command before building: `cd native_src/cpp && sh generate.sh --type rn`
- **Note** android5.0 or above requires data forwarding: `adb reverse tcp:8081 tcp:8081`

## quick start

Please check the specific documentation. [Portal](./docs/quick-start.md)

## demo experience

You can run the demo to experience the api level. [portal](./example/package.json).
You can run a simple demo for experience. [portal](./examples/simple_demo/package.json).

## Contributors

See the [contributing guide](./CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Release Notes

See the [change log](./CHANGELOG.md).

## Version types

See the [version types](./docs/version-types.md).

## License

MIT

## Q&A

[If you encounter problems, please refer to here](./docs/others.md)
