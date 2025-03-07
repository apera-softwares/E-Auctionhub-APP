import { Tabs, useRouter } from "expo-router";
import { SizableText, useTheme } from "tamagui";
import { CircleUser, Home, Search } from "@tamagui/lucide-icons";
import { APP_COLOR } from "constants/Colors";
import { Image, Text } from "react-native";
import { useUser } from "context/UserContextProvider";

export default function TabLayout() {
  const { user } = useUser();
  const router = useRouter();

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
          headerShown: false,
          tabBarIcon: ({ color }) => <Home color={color as any} size={20} />,
          headerRight: () => (
            <SizableText
              style={{
                backgroundColor: APP_COLOR.primary,
                padding: 5,
                borderRadius: 5,
                color: "white",
                marginRight: 5,
              }}
              onPress={() =>
                user.isLogin ? router.push("/") : router.push("/login")
              }
            >
              {user.isLogin ? user.name.slice(0, 13) : "Login/Signup"}
            </SizableText>
          ),
          headerLeft: () => (
            <Image
              style={{ height: 40, width: 50, marginLeft: 5 }}
              source={require("../../assets/images/logo/logo.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerTitle: "Advance Search",
          title: "Advance Search",
          // headerShown:false,
          tabBarIcon: ({ color }) => <Search color={color as any} size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "",
          title: "Account",
          // headerShown: false,
          headerLeft: () => (
            <>
              <Image
                style={{ height: 40, width: 40, marginLeft: 8 }}
                source={require("../../assets/images/logo/logo.png")}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: APP_COLOR.primary,
                }}
              >
                E-AuctionsHub
              </Text>
            </>
          ),
          tabBarIcon: ({ color }) => (
            <CircleUser color={color as any} size={20} />
          ),
        }}
      />
    </Tabs>
  );
}
