import "../tamagui-web.css";

import { useEffect } from "react";
import { Image, StatusBar, Text, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack, useRouter } from "expo-router";
// import { Provider } from "./Provider";
import { SizableText, useTheme } from "tamagui";
import { APP_COLOR } from "constants/Colors";
import BackButton from "components/GoBackButton";
import Toast from "react-native-toast-message";
import Provider from "./Provider";
import AuthContextProvider, { useUser } from "../context/UserContextProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });
  const router = useRouter();

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <Providers>
      <AuthContextProvider>
        <RootLayoutNav />
      </AuthContextProvider>
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

function RootLayoutNav() {
  const { user } = useUser();

  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <>
      <StatusBar
        backgroundColor={colorScheme === "light" ? "#fff" : "#000"}
        barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
      />

      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="auctions"
          options={{
            title: "Auctions",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },

            headerLeft: () => <BackButton />,
          }}
        />
        <Stack.Screen
          name="auctionDetails"
          options={{
            title: "Auction Details",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },

            headerLeft: () => (
              // <Image
              //   style={{ height: 20, width: 120, marginLeft: 5 }}
              //   source={require("../assets/images/logo/logo.png")}
              // />
              <BackButton />
            ),
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: "Signup",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
            headerLeft: () => <BackButton />,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
            headerLeft: () => <BackButton />,
          }}
        />
        <Stack.Screen
          name="verifyOtp"
          options={{
            title: "verifyOtp",
            presentation: "card",
            animation: "slide_from_right",
            // gestureEnabled: true,
            // gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="premium"
          options={{
            title: "Premium",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="paymentSucess"
          options={{
            headerShown: false,
            title: "",
            presentation: "card",
            animation: "slide_from_right",
            // gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="termsAndConditions"
          options={{
            title: "Terms & Conditions",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="privacyAndPolicy"
          options={{
            title: "Privacy & Policy",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "About",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="contact"
          options={{
            title: "Contact Us",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="favourite"
          options={{
            title: "Favourite Auctions",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="deleteAccount"
          options={{
            title: "Delete Account",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="resetPassword"
          options={{
            title: "Reset Password",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
        <Stack.Screen
          name="chnagePassword"
          options={{
            title: "Change Password",
            presentation: "card",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
      </Stack>
    </>
  );
}
