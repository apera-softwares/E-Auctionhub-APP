import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import { APP_COLOR } from "constants/Colors";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import { BACKEND_API } from "constants/api";
import { Ionicons } from "@expo/vector-icons";

const ContactUs = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "All fields are required.",
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a valid email address.",
      });
      return false;
    }
    if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a valid 10-digit phone number.",
      });
      return false;
    }
    if (phone.length === 10) Keyboard.dismiss();
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API}contact-us/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        Toast.show({ type: "success", text1: "Success", text2: data.message });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        Toast.show({ type: "error", text1: "Error", text2: data.message });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>CONTACT US</Text>
          <Text style={styles.subText}>
            Got a question? We're here to help!
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="number-pad"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Message"
            multiline
            numberOfLines={4}
            value={formData.message}
            onChangeText={(text) => handleInputChange("message", text)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={APP_COLOR.primary} />
            <Text style={styles.contactText}>aperasoftwares@gmail.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color={APP_COLOR.primary} />
            <Text style={styles.contactText}>+91 8788241970</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color={APP_COLOR.primary} />
            <Text style={styles.contactText}>Nagpur, Maharashtra</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", height: "150%" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C7285",
  },
  subText: {
    fontSize: 15,
    textAlign: "center",
    color: "gray",
    marginBottom: 22,
    marginTop: 12,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    backgroundColor: "#f2f4f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: APP_COLOR.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  contactItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  contactText: { marginLeft: 10, fontSize: 16, color: "gray" },
});

export default ContactUs;
