import { Tabs, useRouter } from "expo-router";
import { SizableText } from "tamagui";
import { APP_COLOR } from "constants/Colors";
import { Image, View } from "react-native";
import { useUser } from "context/UserContextProvider";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: APP_COLOR.primary,
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.06)",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 56 + insets.bottom,
          borderRadius: 0,
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 8,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "",
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={color}
            />
          ),
          headerRight: () => (
            <SizableText
              style={{
                backgroundColor: APP_COLOR.primary,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 8,
                color: "white",
                marginRight: 12,
                fontSize: 12,
                fontWeight: "600",
              }}
              onPress={() =>
                user?.isLogin ? router.push("/") : router.push("/login")
              }
            >
              {user?.isLogin
                ? user?.name.slice(0, 13) || "Guest User"
                : "Login/Signup"}
            </SizableText>
          ),
          headerLeft: () => (
            <Image
              style={{ height: 40, width: 50, marginLeft: 12 }}
              source={require("../../assets/images/logo/logo.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
