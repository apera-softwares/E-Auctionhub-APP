import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { APP_COLOR } from "constants/Colors";
import { Platform } from "react-native";
import { AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useUser } from "context/UserContextProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const getInitials = (name: string) => {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";
};

const ProfileScreen = () => {
  const { user, setUser } = useUser();
  const isLoggedIn = user?.isLogin;
  const router = useRouter();

  const username = isLoggedIn ? user.name : "Guest User";
  const phoneNumber = isLoggedIn ? user.phone || "N/A" : "";
  const initials = getInitials(username);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      Toast.show({ type: "success", text1: "Logged Out" });
      setUser({
        id: "",
        name: "",
        phone: "",
        role: "USER",
        isLogin: false,
        isSubscribed: false,
        subscribedPlan: null,
      });
      router.push("/login");
    } catch (e) {
      console.log(e, "error");
    }
  };

  return (
    <ScrollView>
      <View style={[styles.scrollContainer, !isLoggedIn && { marginTop: 55 }]}>
        {isLoggedIn && (
          <View style={styles.profileSection}>
            <View style={styles.profileCircle}>
              <Text style={styles.initials}>{initials}</Text>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.usernameContainer}>
                <Text style={styles.username}>{username}</Text>
                {user?.isSubscribed && (
                  <Text style={styles.premiumIcon}>
                    <MaterialCommunityIcons
                      name="crown-circle"
                      size={24}
                      color="gold"
                    />
                  </Text>
                )}
              </View>
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            </View>
          </View>
        )}

        {!isLoggedIn && (
          <Text
            style={{
              marginBottom: 12,
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "center",
              color: APP_COLOR.primary,
              letterSpacing: 0.5,
              textTransform: "capitalize",
            }}
          >
            Create Account to Access More Features!
          </Text>
        )}

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {Platform.OS !== "ios" && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/premium")}
            >
              <Feather name="star" size={22} color={APP_COLOR.primary} />

              <Text style={styles.menuText}>Premium</Text>
            </TouchableOpacity>
          )}
          {isLoggedIn && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/favourite")}
            >
              <Feather name="heart" size={22} color={"red"} />

              <Text style={styles.menuText}>Favorite Auctions</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/about")}
          >
            <Feather name="info" size={22} color={APP_COLOR.primary} />

            <Text style={styles.menuText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/contact")}
          >
            <Feather name="phone" size={22} color={APP_COLOR.primary} />

            <Text style={styles.menuText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/termsAndConditions")}
          >
            <Feather name="file" size={22} color={APP_COLOR.primary} />

            <Text style={styles.menuText}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/privacyAndPolicy")}
          >
            <Feather name="shield" size={22} color={APP_COLOR.primary} />

            <Text style={styles.menuText}>Privacy & Policy</Text>
          </TouchableOpacity>
          {isLoggedIn && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/setting")}
            >
              <Feather name="settings" size={22} color={APP_COLOR.primary} />

              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.authButtonsContainer}>
          {!isLoggedIn ? (
            <>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => router.push("/login")}
              >
                <AntDesign
                  name="login"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => router.push("/signup")}
              >
                <MaterialCommunityIcons
                  name="account-plus"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
                <Text style={styles.authButtonText}>Signup</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
              <AntDesign
                name="logout"
                size={20}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.authButtonText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    // backgroundColor: "#f5f5f5",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  premiumIcon: {
    marginLeft: 5,
    fontSize: 16,
    color: "gold",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#155E95",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initials: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  phoneNumber: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  menuContainer: {
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "500",
    color: "#333",
  },
  authButtonsContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    gap: 10,
  },
  authButton: {
    backgroundColor: APP_COLOR.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
