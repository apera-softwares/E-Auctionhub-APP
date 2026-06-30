import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
import { APP_COLOR } from "constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const AuctionDetails = () => {
  const { auctionId } = useLocalSearchParams() as any;
  const { user } = useUser();
  const [expandedAddress, setExpandedAddress] = useState(false);
  const [freeTrail, setFreeTrail] = useState(false);
  const isPremiumUser = user.isSubscribed;
  const [auctionDetails, setAuctionDetails] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [auctionLink, setAUctionLink] = useState([] as any);
  const [isFallbackCoordinate, setIsFallbackCoordinate] = useState(false);

  const incrementAuctionViewCount = async () => {
    const token = await AsyncStorage.getItem("token");
    let headers: any = {};
    try {
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const URL = `${BACKEND_API}auction/view/${auctionId}`;
      const response = await fetch(URL, {
        method: "POST",
        headers,
      });
      console.log(response, "increment count");
    } catch (error) {
      console.log("error while updating auction view count", error);
    }
  };

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
        const auction = data?.data;
        if (!auction?.latitude || !auction?.longitude) {
          const fallbackCoords = await getLatLngFromCity(auction.city);
          if (fallbackCoords) {
            auction.latitude = fallbackCoords.lat;
            auction.longitude = fallbackCoords.lng;
            setIsFallbackCoordinate(true);
          }
        }

        setFreeTrail(auction?.freeTrail);
        setAuctionDetails(auction);
        setAUctionLink(auction?.documentLink);
      }
    } catch (error) {
      console.log("error while fetching searched by id  auctions", error);
    } finally {
      setLoading(false);
    }
  };

  const getLatLngFromCity = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
          cityName?.toLowerCase()
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "eauctionshubapp/1.0.0",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error("Error fetching coordinates from Nominatim:", error);
    }

    return null;
  };

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${auctionDetails?.latitude},${auctionDetails?.longitude}&hl=es&z=14&amp;output=embed`;

  useEffect(() => {
    if (auctionId) {
      incrementAuctionViewCount();
      getAuctionById();
    }
  }, []);

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={APP_COLOR.primary} />
      <Text style={styles.loadingText}>Loading details, please wait...</Text>
    </View>
  ) : (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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

      <View style={[styles.card, isPremiumUser || freeTrail ? styles.premiumCardActive : styles.premiumCardLocked]}>
        {/* Header decoration for Premium Details */}
        <View style={styles.premiumHeaderRow}>
          <View style={styles.premiumIconBox}>
            <FontAwesome5 name="crown" size={16} color="#EAB308" />
          </View>
          <Text style={styles.premiumTitle}>Premium Investor Details</Text>
        </View>

        {isPremiumUser || freeTrail ? (
          <View style={styles.premiumContent}>
            <PremiumDetailRow
              icon="file-alt"
              title="Loan Account Number"
              text={auctionDetails?.loanAccountNumber || "N/A"}
            />

            <PremiumDetailRow
              icon="user"
              title="Bank Contact Person"
              text={auctionDetails?.contactPerson?.name || "N/A"}
            />

            <PremiumDetailRow
              icon="phone-alt"
              title="Bank Contact Person Phone"
              text={auctionDetails?.contactPerson?.phone || "N/A"}
            />

            <View style={styles.detailRow}>
              <View style={styles.iconBox}>
                <FontAwesome5 name="map-marker-alt" size={15} color="#EAB308" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Property Address</Text>
                {auctionDetails?.propertyAddress ? (
                  <>
                    <Text style={styles.fieldValue}>
                      {expandedAddress || auctionDetails?.propertyAddress?.length <= 95
                        ? auctionDetails?.propertyAddress
                        : `${auctionDetails?.propertyAddress.substring(0, 95)}...`}
                    </Text>
                    {auctionDetails?.propertyAddress?.length > 95 && (
                      <TouchableOpacity onPress={() => setExpandedAddress(!expandedAddress)}>
                        <Text style={styles.readMoreText}>
                          {expandedAddress ? "Show Less" : "Read Full Address"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <Text style={styles.fieldValue}>N/A</Text>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconBox}>
                <FontAwesome5 name="link" size={15} color="#EAB308" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Auction Portal URL</Text>
                {auctionDetails?.auctionUrl ? (
                  <Link href={auctionDetails?.auctionUrl} asChild>
                    <TouchableOpacity style={styles.linkButton} activeOpacity={0.8}>
                      <FontAwesome5 name="external-link-alt" size={11} color="#CA8A04" style={{ marginRight: 6 }} />
                      <Text style={styles.linkButtonText}>Visit Web Portal</Text>
                    </TouchableOpacity>
                  </Link>
                ) : (
                  <Text style={styles.fieldValue}>N/A</Text>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconBox}>
                <FontAwesome5 name="file-pdf" size={15} color="#EAB308" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.fieldTitle}>Notice & Documents</Text>
                {auctionLink?.length && user?.isSubscribed && auctionLink !== "Subscribe to view details" ? (
                  <View style={styles.linksContainer}>
                    {auctionLink?.map((el, index) => (
                      <Link key={index} href={el} asChild>
                        <TouchableOpacity style={styles.linkButton} activeOpacity={0.8}>
                          <FontAwesome5 name="file-download" size={11} color="#CA8A04" style={{ marginRight: 6 }} />
                          <Text style={styles.linkButtonText}>Download Doc {auctionLink.length > 1 ? `#${index + 1}` : ""}</Text>
                        </TouchableOpacity>
                      </Link>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>No documents available</Text>
                )}
              </View>
            </View>

            {auctionDetails?.latitude ? (
              <View style={styles.mapSection}>
                <View style={styles.mapHeader}>
                  <View style={styles.iconBox}>
                    <FontAwesome5 name="map-marked-alt" size={15} color="#EAB308" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldTitle}>Location Map</Text>
                    {isFallbackCoordinate && (
                      <Text style={styles.mapWarningText}>
                        * Exact pin not provided by bank; showing general city locality.
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.mapContainer}>
                  <WebView
                    originWhitelist={["*"]}
                    source={{
                      html: `<iframe src="${googleMapsEmbedUrl}" style="border:0;" allowFullScreen height="100%" width="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>`,
                    }}
                    style={styles.mapWebView}
                  />
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.lockedContainer}>
            <UnSubPremiumCard auctionId={auctionId} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const PremiumDetailRow = ({ icon, title, text }) => (
  <View style={styles.detailRow}>
    <View style={styles.iconBox}>
      <FontAwesome5 name={icon} size={15} color="#EAB308" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.fieldTitle}>{title}</Text>
      <Text style={styles.fieldValue}>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 18,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  premiumCardActive: {
    borderColor: "rgba(234, 179, 8, 0.3)",
    borderWidth: 1.5,
    backgroundColor: "#ffffff",
  },
  premiumCardLocked: {
    borderColor: "#e2e8f0",
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  premiumHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  premiumIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
  },
  premiumContent: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(234, 179, 8, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  fieldTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    lineHeight: 20,
  },
  readMoreText: {
    color: APP_COLOR.primary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  linkButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(234, 179, 8, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.25)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 4,
  },
  linkButtonText: {
    color: "#CA8A04",
    fontSize: 12,
    fontWeight: "700",
  },
  linksContainer: {
    gap: 8,
  },
  mapSection: {
    marginTop: 10,
    gap: 10,
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mapWarningText: {
    fontSize: 10,
    color: "#f59e0b",
    fontWeight: "500",
    marginTop: 1,
  },
  mapContainer: {
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  mapWebView: {
    flex: 1,
  },
  lockedContainer: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
});

export default AuctionDetails;
