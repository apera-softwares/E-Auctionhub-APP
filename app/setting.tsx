import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { APP_COLOR } from "constants/Colors";
import { useRouter } from "expo-router";

const Setting = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          router.push({
            pathname: `/resetPassword`,
            params: { from: "profile" },
          })
        }
      >
        <Feather name="lock" size={22} color={APP_COLOR.primary} />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.option}>
        <Feather name="bell" size={20} color="#007AFF" />
        <Text style={styles.optionText}>Notification Preferences</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push("/deleteAccount")}
      >
        <Feather name="trash-2" size={20} color="#FF3B30" />
        <Text style={styles.optionText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push("/contact")}
      >
        <Feather name="help-circle" size={20} color="#007AFF" />
        <Text style={styles.optionText}>Help & Support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3, // Shadow effect for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "500",
    color: "#333",
  },
});

export default Setting;
