import { APP_COLOR } from "constants/Colors";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BACKEND_API } from "constants/api";

const changePassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { phone, from } = useLocalSearchParams() as any;
console.log(phone,"phone")


  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match." });
      return false;
    }
    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters.",
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const payload = {
          phone: phone,
          password: formData.password.trim(),
        };
        const response = await fetch(`${BACKEND_API}user/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.statusCode === 200) {
          Toast.show({
            type: "success",
            text1: "Password Changed Successfull",
          });

          setTimeout(() => {
            if (from == "login") {
              router.replace("/login");
            } else {
              router.replace("/profile");
            }
          }, 1000);
        } else {
          Toast.show({ type: "error", text1: data?.message });
        }
      } catch (e) {
        console.log("failed while sending otp");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Enter New Password</Text>
        <Toast />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
          />
        </View>

        <TouchableOpacity
          onPress={handleResetPassword}
          style={styles.authButton}
        >
          <Text style={styles.authButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: APP_COLOR.primary,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    backgroundColor: "#f2f4f5",
    // borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  checkboxText: {
    marginHorizontal: 10,
    fontSize: 14,
    textAlign: "center",
    flexShrink: 1, // Prevents text from going out of the screen
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
    alignItems: "center",
    marginTop: 20,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 16,
    color: APP_COLOR.primary,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default changePassword;
