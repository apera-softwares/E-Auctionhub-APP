import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { APP_COLOR } from "constants/Colors";
import { WebView } from "react-native-webview";
import { useEffect, useState } from "react";
import { BACKEND_API } from "constants/api";
import { useUser } from "../context/UserContextProvider";
import UnSubPremiumCard from "components/UnSubPremiumCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formateDate, onShare } from "constants/staticData";
import PublicAuctionDetailsCard from "components/PublicAuctionDetailsCard";

const AuctionDetails = () => {
  const { auctionId } = useLocalSearchParams() as any;
  const { user } = useUser();

  console.log(user, "user Data");

  const isPremiumUser = user.isSubscribed;
  const [auctionDetails, setAuctionDetails] = useState({} as any);
  const [loading, setLoading] = useState(true);

  const getAuctionById = async () => {
    const token = await AsyncStorage.getItem("token");

    let headers: any = {};
    try {
      setLoading(true);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const URL = `${BACKEND_API}auction/get/${auctionId}`;
      const response = await fetch(URL, {
        headers,
      });
      const data = await response.json();
      console.log(data);

      if (data.statusCode === 200) {
        setAuctionDetails(data?.data);
      }
    } catch (error) {
      console.log("error while fetching searched by id  auctions", error);
    } finally {
      setLoading(false);
    }
  };

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${auctionDetails.latitude},${auctionDetails.longitude}&hl=es&z=14&amp;output=embed`;

  useEffect(() => {
    getAuctionById();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <PublicAuctionDetailsCard
        assetType={auctionDetails.assetType}
        areaSqFt={auctionDetails.areaSqFt}
        reservePrice={auctionDetails.reservePrice}
        emd={auctionDetails.emd}
        bank={auctionDetails.bank}
        city={auctionDetails.city}
        state={auctionDetails.state}
        locality={auctionDetails.locality}
        startDate={auctionDetails.startDate}
        applicationDeadLine={auctionDetails.applicationDeadLine}
      />

      <View style={[styles.card, styles.premiumCard]}>
        <Text style={styles.premiumTitle}>Premium Details</Text>
        {isPremiumUser ? (
          <View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="file-alt" size={20} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Loan Account Number</Text>
                <Text style={styles.fieldValue}>
                  {auctionDetails.loanAccountNumber}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5 name="user" size={20} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}> Bank Contact Person</Text>
                <Text style={styles.fieldValue}>
                  {auctionDetails?.contactPerson?.name || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5 name="phone-alt" size={20} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Bank Contact Person Phone</Text>
                <Text style={styles.fieldValue}>
                  {auctionDetails?.contactPerson?.phone || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5
                name="map-marker-alt"
                size={20}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Property Address</Text>
                <Text style={styles.fieldValue}>
                  {auctionDetails.propertyAddress || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5
                name="map-marker-alt"
                size={20}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Auction URL</Text>
                <Text style={styles.fieldValue}>
                  {auctionDetails.auctionUrl ? (
                    <Link
                      href={auctionDetails?.auctionUrl}
                      style={{ color: "blue" }}
                    >
                      Link
                    </Link>
                  ) : (
                    "NA"
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5 name="file-pdf" size={20} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Documents Link</Text>
                {auctionDetails?.documentLink?.length > 0 ? (
                  auctionDetails?.documentLink.map((el, index) => (
                    <Link key={index} href={el} style={{ color: "blue" }}>
                      {el}
                    </Link>
                  ))
                ) : (
                  <Text style={styles.fieldValue}>No documents available</Text>
                )}
              </View>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome5
                name="map-marked-alt"
                size={20}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Map</Text>
                <Text style={styles.fieldValue}>
                  {!auctionDetails.latitude && "NA"}
                </Text>
              </View>
            </View>
            {auctionDetails.latitude && (
              <View
                style={{
                  height: 250,
                  shadowColor: "black",
                  shadowOffset: { width: -1, height: 1 },
                  shadowRadius: 18,
                }}
              >
                <WebView
                  originWhitelist={["*"]}
                  source={{
                    html: `<iframe src="${googleMapsEmbedUrl}" style="border:0;" allowFullScreen height="100%" width="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>`,
                  }}
                />
              </View>
            )}
          </View>
        ) : (
          <UnSubPremiumCard />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#f8f9fa" },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    margin: 7,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },

  premiumCard: {
    position: "relative",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gold",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#d4af37",
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
  fieldValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
  },
});

export default AuctionDetails;
