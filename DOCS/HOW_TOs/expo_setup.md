### Configure Expo app

Expo doesn't use the .env for the publishable key, so you will need to go to `apps/expo/app.config.ts` and add it there.

```
const CLERK_PUBLISHABLE_KEY = "your-clerk-publishable-key";

```

### Configure Expo `dev`-script

> **Note:** If you want to use a physical phone with Expo Go, just run `pnpm dev` and scan the QR-code.

#### For Android

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator/).
2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

```diff
+  "dev": "expo start --android",
```

3. Run `pnpm dev` at the project root folder.

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator/).
2. Change the `dev` script at `apps/expo/package.json` to open the iOS simulator.

```diff
+  "dev": "expo start --ios",
```

3. Run `pnpm dev` at the project root folder.

## References

The stack originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
