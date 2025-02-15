import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const AuctionDetails = () => {
  const { auctionId } = useLocalSearchParams() as any;
  const isPremiumUser = false; // Change this based on user subscription

  const auctionData = {
    location: "Manewada, Nagpur",
    assetType: "Flat",
    bankName: "Bank of India",
    area: "1500 sqft",
    state: "Maharashtra",
    city: "Nagpur",
    applicationDate: "2024-03-15",
    applicationDeadline: "2024-04-15",
    loanAccountNumber: "1234-5678-9101",
    bankContactPerson: "John Doe",
    propertyAddress: "123 Main Street, Nagpur",
    documents: "Confidential Docs.pdf",
    earnestMoneyDeposit: "500,000 INR",
    reservePrice: "2,500,000 INR",
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Auction Details</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity>
            <FontAwesome5 name="heart" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome5 name="share-alt" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome5 name="copy" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>
            <FontAwesome5 name="map-marker-alt" size={20} /> Location:{" "}
            {auctionData.location}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="building" size={20} /> Asset Type:{" "}
            {auctionData.assetType}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="university" size={20} /> Bank Name:{" "}
            {auctionData.bankName}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="ruler-combined" size={20} /> Area:{" "}
            {auctionData.area}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="flag" size={20} /> State: {auctionData.state}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="city" size={20} /> City: {auctionData.city}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="calendar-alt" size={20} /> Application Date:{" "}
            {auctionData.applicationDate}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="clock" size={20} /> Application Deadline:{" "}
            {auctionData.applicationDeadline}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="coins" size={20} /> Earnest Money Deposit:{" "}
            {auctionData.earnestMoneyDeposit}
          </Text>
          <Text style={styles.field}>
            <FontAwesome5 name="tags" size={20} /> Reserve Price:{" "}
            {auctionData.reservePrice}
          </Text>
        </View>
      </View>

      <View style={[styles.card, styles.premiumCard]}>
        <Text style={styles.premiumTitle}>Premium Details</Text>
        {isPremiumUser ? (
          <View>
            <Text style={styles.premiumField}>
              <FontAwesome5 name="file-alt" size={20} /> Loan Account Number:{" "}
              {auctionData.loanAccountNumber}
            </Text>
            <Text style={styles.premiumField}>
              <FontAwesome5 name="user" size={20} /> Bank Contact Person:{" "}
              {auctionData.bankContactPerson}
            </Text>
            <Text style={styles.premiumField}>
              <FontAwesome5 name="map-marked-alt" size={20} /> Property Address:{" "}
              {auctionData.propertyAddress}
            </Text>
            <Text style={styles.premiumField}>
              <FontAwesome5 name="file-pdf" size={20} /> Documents:{" "}
              {auctionData.documents}
            </Text>
          </View>
        ) : (
          <View style={styles.lockedContent}>
            <Text style={styles.premiumField}>
              Loan Account Number: ************
            </Text>
            <Text style={styles.premiumField}>
              Bank Contact Person: ********
            </Text>
            <Text style={styles.premiumField}>
              Property Address: ************
            </Text>
            <Text style={styles.premiumField}>Documents: **********</Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <FontAwesome5 name="crown" size={18} color="white" />
              <Text style={styles.upgradeText}> Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa" },
  card: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldContainer: { marginBottom: 10 },
  field: { fontSize: 20, marginVertical: 6 },
  premiumCard: {
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "gold",
    padding: 30,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#d4af37",
  },
  premiumField: {
    fontSize: 18,
    marginVertical: 6,
    fontWeight: "bold",
    opacity: 0.6,
  },
  lockedContent: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    // filter: "blur(8px)",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gold",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  upgradeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default AuctionDetails;
