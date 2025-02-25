import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContextProvider";
import { BACKEND_API } from "constants/api";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentSuccess = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const URL = `${BACKEND_API}user/get-user`;
      const response = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.statusCode === 200) {
        setUser((prev) => ({
          ...prev,
          id: data?.data?.id,
          name: data?.data?.name,
          phone: data?.data?.phone,
          role: data?.data?.role,
          isSubscribed: data?.data?.subscribed,
          subscribedPlan: data?.data?.subscribedPlan?.[0] || null,
        }));
      }
    } catch (error) {
      console.log("Error fetching user data", error);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="checkmark-circle"
        size={80}
        color="green"
        style={styles.icon}
      />
      <Text style={styles.title}>Payment Successful</Text>
      <Ionicons
        name="trophy"
        size={60}
        color="gold"
        style={styles.trophyIcon}
      />
      <Text style={styles.subtitle}>Thank you for subscribing!</Text>
      <Text style={styles.description}>
        You have successfully subscribed to AuctionHub. Enjoy premium features
        and more!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  trophyIcon: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: "#444",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentSuccess;
