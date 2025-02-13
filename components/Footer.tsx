import { View, Text, StyleSheet, Linking } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      {/* Links Section */}
      {/* <View style={styles.sectionBox}>
        <View style={styles.linksContainer}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.eauctionshub.com/privacy-policy")
            }
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.eauctionshub.com/terms-and-conditions"
              )
            }
          >
            <Text style={styles.linkText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Contact Section */}
      {/* <View style={styles.sectionBox}>
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>📧 aperasoftwares@gmail.com</Text>
          <Text style={styles.contactText}>📞 +91 8788241970</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.eauctionshub.com")}
          >
            <Text style={styles.websiteText}>🌐 www.eauctionshub.com</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Copyright & Developer Info */}
      <View style={styles.sectionBox}>
        <Text style={styles.copyright}>
          © 2025 E-AuctionHub. All rights reserved.
        </Text>
        <Text style={styles.copyright}>
          🚀 Developed by{" "}
          <Text
            style={styles.developerText}
            onPress={() =>
              Linking.openURL(
                "https://www.eauctionshub.com/terms-and-conditions"
              )
            }
          >
            Aperra Solution
          </Text>
        </Text>
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
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
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
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  linkText: {
    color: "#1E90FF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  contactContainer: {
    alignItems: "center",
    gap: 5,
  },
  contactText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  websiteText: {
    color: "#1E90FF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
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
});
