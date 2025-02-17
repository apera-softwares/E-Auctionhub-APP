import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { APP_COLOR } from "constants/Colors";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join(" ");
};

const ProfileScreen = ({ isLoggedIn = false }) => {
  const router = useRouter();
  const username = isLoggedIn ? "Rahul Singh Verma" : null;
  const initials = username ? getInitials(username) : "";

  return (
    // <ImageBackground
    //   source={require("../../assets/images/home.jpg")}
    //   style={styles.container}
    // >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Profile Section */}
      {isLoggedIn && (
        <View style={styles.profileSection}>
          <View style={styles.profileCircle}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <Text style={styles.username}>{username}</Text>
        </View>
      )}

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Navigate to Premium")}
        >
          <MaterialIcons
            name="star"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.menuText}>Premium</Text>
        </TouchableOpacity>
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log("Navigate to ChangePassword")}
          >
            <MaterialIcons
              name="lock"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.menuText}>Change Password</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Navigate to AboutUs")}
        >
          <MaterialIcons
            name="info"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Navigate to ContactUs")}
        >
          <MaterialIcons
            name="phone"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.menuText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Navigate to Premium")}
        >
          <MaterialIcons
            name="star"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.menuText}>Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Navigate to TermsConditions")}
        >
          <MaterialIcons
            name="description"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.menuText}>Terms and Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Navigate to PrivacyPolicy")}
        >
          <MaterialIcons
            name="shield"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Auth Buttons */}
      <View style={styles.authButtonsContainer}>
        {!isLoggedIn ? (
          <>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() =>
                router.push({
                  pathname: `/login`,
                })
              }
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
              onPress={() =>
                router.push({
                  pathname: `/signup`,
                })
              }
            >
              <MaterialIcons
                name="create-new-folder"
                size={20}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.authButtonText}>Signup</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.authButton}>
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
    </ScrollView>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Fallback color for the background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  initials: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },
  menuContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
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
    marginTop: 10,
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
