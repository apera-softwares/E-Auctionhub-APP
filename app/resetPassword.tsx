import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useUser } from "context/UserContextProvider";
import EnterMobToRestPass from "components/EnterMobToRestPass";
import { BACKEND_API } from "constants/api";
import Toast from "react-native-toast-message";
import { useLocalSearchParams, useRouter } from "expo-router";

const ResetPassword = () => {
  const { from } = useLocalSearchParams() as any;
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSendOTP = async () => {
    try {
      setLoading(true);

      const payload = {
        phone: user.phone,
        platform: Platform.OS === "android" ? "android" : null,
      };
      const response = await fetch(`${BACKEND_API}user/send-otp-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.statusCode === 200) {
        Toast.show({ type: "success", text1: "OTP sent successfully" });
        router.push({
          pathname: `/verifyOtp`,
          params: { from: "profile", phone: user.phone },
        });
      } else {
        Toast.show({
          type: "error",
          text1: data?.message || "Failed to send OTP",
        });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Network error, try again later" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.heading}>Reset Password</Text>
      <View style={styles.card}>
        {user.phone ? (
          <>
            <Text style={styles.description}>
              Send OTP to change password to your registered mobile number
            </Text>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <EnterMobToRestPass from={from} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetPassword;
