## First Deployments

> This section will cover the first deployments of our applications. Once we have active deployments, we can start to automate the deployment process. See [Continued Deployments](/docs/maintainers/continued-deployments.md) for more information.

### Expo

Deploying our Expo application works slightly differently compared to Next.js on the web. Instead of "deploying" our app online, we need to submit production builds of our app to the app stores, like [Apple App Store](https://www.apple.com/app-store/) and [Google Play](https://play.google.com/store/apps).

Read the full [Distributing your app](https://docs.expo.dev/distribution/introduction/), including best practices, in the Expo docs for more information.

1. Let's start by setting up [EAS Build](https://docs.expo.dev/build/introduction/), which is short for Expo Application Services. The build service helps us create builds of the app, without requiring a full native development setup. The commands below are a summary of [Creating your first build](https://docs.expo.dev/build/setup/).

   ```bash
   // Install the EAS CLI
   $ pnpm add -g eas-cli

   // Log in with your Expo account
   $ eas login

   // Configure your Expo app
   $ cd apps/expo
   $ eas build:configure
   ```

2. After the initial setup, we can create the first build. We can build for Android and iOS platforms and use different [**eas.json** build profiles](https://docs.expo.dev/build-reference/eas-json/) to create production builds or development, or test builds. Let's make a production build for iOS.

   ```
   $ eas build --platform ios --profile production
   ```

   > If not specifying the `--profile` flag, EAS uses the `production` profile by default.

3. Now that we have our first production build, we can submit this to the stores. [EAS Submit](https://docs.expo.dev/submit/introduction/) can help send the build to the stores.

   ```
   $ eas submit --platform ios --latest
   ```

   > Can also combine build and submit in a single command, using `eas build ... --auto-submit`.

4. Before we can get our app in the hands of our users, we'll have to provide additional information to the app stores. This includes screenshots, app information, privacy policies, etc. _While still in preview_, [EAS Metadata](https://docs.expo.dev/eas/metadata/) can help us with most of this information.

5. As we're using OAuth social providers with Clerk, like Google, Discord, Facebook, Github, etc..., we must whitelist our own OAuth redirect URL for the Expo application in the Clerk Dashboard.

   In `apps/expo/app.config.ts`, make sure to have a `scheme` that will be used to identify our standalone app.

   ```ts
   import { ExpoConfig, ConfigContext } from "@expo/config";

   const CLERK_PUBLISHABLE_KEY = "your-clerk-publishable-key";

   const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
     name: "expo",
     slug: "expo",
     scheme: "your-app-scheme",
     // ...
   });
   ```

   Then, in the [Clerk Dashboard](https://dashboard.clerk.dev/), go to **User & Authentication > Social Connections > Settings** and verify that our app's scheme and redirect URLs are in the the **Redirect URLs** field:

   ```txt
   your-app-scheme://oauth-native-callback
   ```

   Here, `your-app-scheme` corresponds to the `scheme` defined in `app.config.ts`, and `oauth-native-callback` corresponds to the redirect URL defined when authenticating with social providers. See [SignInWithOAuth.tsx](/apps/expo/src/components/SignInWithOAuth.tsx) for reference.

   > More information about this can be fund in the [Expo documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/#redirecting-to-your-app).

   We should now be able to sign in with our social providers in the TestFlight application build.

6. Once everything is approved, our users can finally enjoy our app. Let's say we've spotted a small typo; we'll have to create a new build, submit it to the stores, and wait for approval before we can resolve this issue. In these cases, we can use EAS Update to quickly send a small bugfix to your users without going through this long process. Let's start by setting up EAS Update.

   The steps below summarize the [Getting started with EAS Update](https://docs.expo.dev/eas-update/getting-started/#configure-your-project) guide.

   ```bash
   // Add the `expo-updates` library to your Expo app
   $ cd apps/expo
   $ pnpm expo install expo-updates

   // Configure EAS Update
   $ eas update:configure
   ```

7. Before we can send out updates to our app, we have to create a new build and submit it to the app stores. For every change that includes native APIs, we have to rebuild the app and submit the update to the app stores. See steps 2 and 3.

8. Now that everything is ready for updates, let's create a new update for `production` builds. With the `--auto` flag, EAS Update uses our current git branch name and commit message for this update. See [How EAS Update works](https://docs.expo.dev/eas-update/how-eas-update-works/#publishing-an-update) for more information.

   ```bash
   $ cd apps/expo
   $ eas update --auto
   ```

   > Your OTA (Over The Air) updates must always follow the app store's rules. You can't change your app's primary functionality without getting app store approval. But this is a fast way to update your app for minor changes and bug fixes.

9. Done! Now that we have created our production build, submitted it to the stores, and installed EAS Update, we are ready for anything!
