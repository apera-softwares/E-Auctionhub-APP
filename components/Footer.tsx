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
        <Text style={styles.copyright}>
          © 2025 E-AuctionsHub. All rights reserved.
        </Text>
        {/* <Text style={styles.copyright}>
          🚀 Website{" "}
          <Text
            style={styles.developerText}
            onPress={() => Linking.openURL("https://www.eauctionshub.com/")}
          >
            E AuctionsHub
          </Text>
        </Text> */}
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.facebook.com/eauctionshub")
            }
            style={styles.icon}
          >
            <FontAwesome name="facebook" size={13} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() =>
              Linking.openURL("https://www.instagram.com/eauctionshub/")
            }
          >
            <FontAwesome name="instagram" size={13} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() =>
              Linking.openURL("https://www.linkedin.com/company/eauctionshub/")
            }
          >
            <FontAwesome name="linkedin" size={13} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    opacity: 0.9,
    width: "100%",
  },
  sectionBox: {
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    width: "95%",
    alignItems: "center",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 10,
  },
  copyright: {
    color: "#bbb",
    fontSize: 12,
    fontWeight: "500",
  },
  developerText: {
    color: "#1E90FF",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  icon: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 4,
    borderRadius: 5,
    width: 23,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
  },
});
