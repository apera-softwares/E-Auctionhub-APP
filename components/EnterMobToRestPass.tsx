import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Platform,
} from "react-native";
import { BACKEND_API } from "constants/api";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { getHash } from "react-native-otp-verify";

const EnterMobToRestPass = (from) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (Platform.OS === "android") {
      getHash()
        .then((hash) => {
          setHash(hash[0]);
        })
        .catch((error) => {
          console.error("Error occurred while getting hash:", error);
        });
    }

    return () => {};
  }, []);

  const handlePhoneChange = (text: string) => {
    // Allow only numeric input and limit to 10 digits
    const cleanedText = text.replace(/[^0-9]/g, "");
    if (cleanedText.length <= 10) {
      setPhone(cleanedText);
    }
    if (cleanedText.length === 10) {
      Keyboard.dismiss();
    }
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Toast.show({
        type: "error",
        text1: "Enter a valid 10-digit mobile number",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        phone: `+91${phone}`,
        platform: Platform.OS === "android" ? "android" : null,
        hashCode: Platform.OS === "android" ? hash : null,
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
          params: { from: "login", phone: `+91${phone}` },
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
    <View>
      <Text style={styles.label}>Enter your mobile number</Text>
      <TextInput
        placeholder="Mobile Number"
        keyboardType="numeric"
        style={styles.input}
        value={phone}
        onChangeText={handlePhoneChange}
        maxLength={10}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#7aa9e9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EnterMobToRestPass;
