import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "context/UserContextProvider";
import { useRouter } from "expo-router";

const UnSubPremiumCard = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleUpgradePremium = () => {
    if (user.isLogin) {
      router.push("/premium");
    } else {
      router.push("/login");
    }
  };

  return (
    <View style={styles.lockedContent}>
      <View style={styles.detailRow}>
        <FontAwesome5 name="map-marker-alt" size={20} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.fieldTitle}>Loan Account Number:</Text>
          <Text
            style={{
              textShadowColor: "black",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 18,
              color: "transparent",
            }}
          >
            Test123AbcTest222555555
          </Text>
        </View>
      </View>
      <View style={styles.detailRow}>
        <FontAwesome5 name="user" size={20} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.fieldTitle}>Bank Contact Person:</Text>
          <Text
            style={{
              textShadowColor: "black",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 18,
              color: "transparent",
            }}
          >
            1234567890
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <FontAwesome5 name="map-marker-alt" size={20} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.fieldTitle}>Property Address:</Text>
          <Text
            style={{
              textShadowColor: "black",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 18,
              color: "transparent",
            }}
          >
            123, xyz Abc XXXXXXX xxxxxXXXXXX XX
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <FontAwesome5 name="file-pdf" size={20} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.fieldTitle}>Documents:</Text>
          <Text
            style={{
              textShadowColor: "black",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 18,
              color: "transparent",
            }}
          >
            www.asdsads.sadsda
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <FontAwesome5 name="map-marker-alt" size={20} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.fieldTitle}>Location on Map:</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={handleUpgradePremium}
      >
        <FontAwesome5 name="crown" size={18} color="white" />
        <Text style={styles.upgradeText}> Upgrade to Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  lockedContent: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    justifyContent: "center",
    borderRadius: 15,
    textAlign: "left",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gold",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  upgradeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    color: "#d4af37",
  },

  textContainer: {
    flex: 1,
  },
  fieldTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default UnSubPremiumCard;
