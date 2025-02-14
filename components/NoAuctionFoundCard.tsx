import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const RenderFooter = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 20,
        marginTop: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        alignSelf: "center",
        marginBottom: 5,
      }}
    >
      <MaterialIcons name="gavel" size={50} color="#888" />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          marginTop: 10,
        }}
      >
        No Auctions Available
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#666",
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Check back later for upcoming auctions.
      </Text>
    </View>
  );
};

export default RenderFooter;
