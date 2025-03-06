import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API } from "constants/api";
import { APP_COLOR } from "constants/Colors";
import { useUser } from "context/UserContextProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

const DeleteAccount = () => {
  const [pass, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleDeletePress = () => {
    setModalVisible(true);
  };

  const confirmDelete = () => {
    setModalVisible(false);
    handleDeleteAccount();
  };

  const handleDeleteAccount = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_API}user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: pass,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        Toast.show({ type: "success", text1: "Account Delete Successful" });
        handleLogout();
        router.push("/");
      } else {
        Toast.show({ type: "error", text1: data.message });
      }
    } catch (error) {
      console.error("Error Deleting Doctor:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Delete Account</Text>
        <Toast />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={pass}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={handleDeletePress}
          style={styles.deleteAccountBtn}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: "gray" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.authButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.authButton}
                onPress={confirmDelete}
              >
                <Text style={styles.authButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
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
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  authButton: {
    backgroundColor: APP_COLOR.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    padding: 5,
    width: "40%",
  },
  deleteAccountBtn: {
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default DeleteAccount;
