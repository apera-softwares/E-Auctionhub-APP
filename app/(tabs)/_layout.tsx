import { Link, Tabs } from "expo-router";
import { Button, H4, H5, H6, SizableText, useTheme } from "tamagui";
import {
  Atom,
  AudioWaveform,
  CircleUser,
  Home,
  Search,
} from "@tamagui/lucide-icons";
import { APP_COLOR } from "constants/Colors";
import { Image } from "react-native";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "",
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color as any} />,
          headerRight: () => (
            <SizableText
              style={{
                backgroundColor: APP_COLOR.primary,
                padding: 5,
                borderRadius: 5,
                color: "white",
                marginRight: 5,
              }}
            >
              Demo User
              {/* <CircleUser color={"white" as any} /> */}
            </SizableText>
          ),
          headerLeft: () => (
            // <H6
            //   style={{
            //     color: APP_COLOR.primary,
            //     borderRadius: 5,

            //     fontWeight: 700,
            //     marginLeft: 5,
            //   }}
            // >
            //   AuctionHub
            // </H6>
            <Image
              style={{ height: 20, width: 120, marginLeft: 5 }}
              source={require("../../assets/images/logo/logo.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Advance Search",
          tabBarIcon: ({ color }) => <Search color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <CircleUser color={color as any} />,
        }}
      />
    </Tabs>
  );
}
