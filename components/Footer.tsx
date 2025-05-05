import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.sectionBox}>
        {/* Social Icons on the left */}
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.facebook.com/eauctionshub")
            }
            style={styles.icon}
          >
            <FontAwesome name="facebook" size={14} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.instagram.com/eauctionshub/")
            }
            style={styles.icon}
          >
            <FontAwesome name="instagram" size={14} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.linkedin.com/company/eauctionshub/")
            }
            style={styles.icon}
          >
            <FontAwesome name="linkedin" size={14} color="#0077B5" />
          </TouchableOpacity>
        </View>

        {/* Copyright text on the right */}
        <Text style={styles.copyright}>
          © 2025 E-AuctionsHub. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#111",
    paddingVertical: 6, // Reduced height
    paddingHorizontal: 10,
    width: "100%",
  },
  sectionBox: {
    flexDirection: "row", // Arrange left and right
    justifyContent: "space-between", // Space between icons and text
    alignItems: "center", // Center vertically
    backgroundColor: "#1a1a1a",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  socialIconsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  copyright: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "500",
  },
  icon: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
