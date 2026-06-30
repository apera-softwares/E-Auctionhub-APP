import { Tabs, useRouter } from "expo-router";
import { SizableText } from "tamagui";
import { APP_COLOR } from "constants/Colors";
import { Image, Text, View } from "react-native";
import { useUser } from "context/UserContextProvider";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: APP_COLOR.primary, // Premium primary blue active icon
        tabBarInactiveTintColor: "#64748b", // Soft slate gray inactive icon
        tabBarStyle: {
          backgroundColor: "#ffffff", // Pure white background
          borderTopWidth: 0,
          position: "absolute",
          bottom: 36, // Positioned higher up to clear phone menu tabs cleanly
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 6,
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.05)",
          paddingBottom: 8,
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
          headerTitle: "",
          title: "Account",
          headerStyle: {
            backgroundColor: "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: "#f1f5f9",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerLeft: () => (
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}>
              <Image
                style={{ height: 32, width: 32, marginRight: 8 }}
                source={require("../../assets/images/logo/logo.png")}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#1e293b",
                }}
              >
                E-AuctionsHub
              </Text>
            </View>
          ),
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
