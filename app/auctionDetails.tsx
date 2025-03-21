import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useEffect, useState } from "react";
import { BACKEND_API } from "constants/api";
import { useUser } from "../context/UserContextProvider";
import UnSubPremiumCard from "components/UnSubPremiumCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PublicAuctionDetailsCard from "components/PublicAuctionDetailsCard";
// import TrialExpiredModal from "components/Modals/FreeTrailExpiry";

const AuctionDetails = () => {
  const { auctionId } = useLocalSearchParams() as any;
  const { user } = useUser();
  const [expandedAddress, setExpandedAddress] = useState(false);
  const [freeTrail, setFreeTrail] = useState(false);
  const isPremiumUser = user.isSubscribed;
  const [auctionDetails, setAuctionDetails] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [auctionLink, setAUctionLink] = useState([] as any);
  const [modalVisible, setModalVisible] = useState(true);

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
      console.log(data.data, "auction details");

      if (data.statusCode === 200) {
        setFreeTrail(data?.data.freeTrail);
        setAuctionDetails(data?.data);
        console.log(data.data?.documentLink, "document link");
        setAUctionLink(data.data?.documentLink);
      }
    } catch (error) {
      console.log("error while fetching searched by id  auctions", error);
    } finally {
      setLoading(false);
    }
  };

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${auctionDetails?.latitude},${auctionDetails?.longitude}&hl=es&z=14&amp;output=embed`;

  useEffect(() => {
    if (auctionId) {
      getAuctionById();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <PublicAuctionDetailsCard
        auctionId={auctionDetails?.id}
        assetType={auctionDetails?.assetType}
        areaSqFt={auctionDetails?.areaSqFt}
        reservePrice={auctionDetails?.reservePrice}
        emd={auctionDetails?.emd}
        bank={auctionDetails?.bank}
        city={auctionDetails?.city}
        state={auctionDetails?.state}
        locality={auctionDetails?.locality}
        startDate={auctionDetails?.startDate}
        applicationDeadLine={auctionDetails?.applicationDeadLine}
        isFav={auctionDetails?.favourite}
        images={auctionDetails?.imageUrl}
      />
    
      <View style={[styles.card, styles.premiumCard]}>
        <Text style={styles.premiumTitle}>Premium Details</Text>
        {isPremiumUser || freeTrail ? (
          <View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="file-alt" size={20} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Loan Account Number</Text>
                <Text style={styles.fieldValue}>
                  {auctionDetails?.loanAccountNumber}
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
              {auctionDetails?.propertyAddress ? (
                <View style={styles.textContainer}>
                  <Text style={styles.fieldTitle}>Property Address</Text>
                  <Text style={styles.fieldValue}>
                    {expandedAddress ||
                      auctionDetails?.propertyAddress?.length <= 95
                      ? auctionDetails?.propertyAddress
                      : `${auctionDetails?.propertyAddress.substring(
                        0,
                        95
                      )}...`}
                  </Text>
                  {auctionDetails?.propertyAddress?.length > 95 && (
                    <TouchableOpacity
                      onPress={() => setExpandedAddress(!expandedAddress)}
                    >
                      <Text style={styles.readMoreText}>
                        {expandedAddress ? "Read Less" : "Read More"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.textContainer}>
                  <Text style={styles.fieldTitle}>Property Address</Text>
                  <Text style={styles.fieldValue}>NA</Text>
                </View>
              )}
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5
                name="map-marker-alt"
                size={20}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Auction URL</Text>
                <Text
                  style={{
                    backgroundColor: "#d4af37",
                    color: "white",
                    padding: 3,
                    width: 90,
                    textAlign: "center",
                    borderRadius: 10,
                    marginBottom: 3,
                  }}
                >
                  {auctionDetails?.auctionUrl ? (
                    <Link href={auctionDetails?.auctionUrl}>View Link</Link>
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
                {auctionLink.length &&
                  user.isSubscribed &&
                  auctionLink !== "Subscribe to view details" ? (
                  auctionLink?.map((el, index) => (
                    <Link
                      key={index}
                      href={el}
                      style={{
                        backgroundColor: "#d4af37",
                        color: "white",
                        width: 90,
                        padding: 3,
                        textAlign: "center",
                        borderRadius: 10,
                        marginBottom: 3,
                      }}
                    >
                      View Link
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
                  {!auctionDetails?.latitude && "NA"}
                </Text>
              </View>
            </View>
            {auctionDetails?.latitude && (
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
          <>
            <Text style={styles.freeTrailHeading}>
              Your free trial has expired! Upgrade to Premium for full access.
            </Text>
            <UnSubPremiumCard auctionId={auctionId} />
          </>
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
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
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
  readMoreText: {
    color: "blue",
    marginTop: 5,
  },
  freeTrailHeading: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#d4af37",
  },
});

export default AuctionDetails;
