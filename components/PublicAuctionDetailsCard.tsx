import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { formateDate, onShare } from "constants/staticData";
import { BACKEND_API } from "constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useUser } from "context/UserContextProvider";
import { useRouter } from "expo-router";
import { APP_COLOR } from "constants/Colors";

const { width } = Dimensions.get("window");

interface PublicAuctionDetailsCardProps {
  assetType: string;
  areaSqFt?: string;
  reservePrice?: string;
  emd: string;
  bank: string;
  locality: string;
  city: string;
  state: string;
  startDate: string;
  applicationDeadLine: string;
  auctionId: string;
  isFav: boolean;
  images: any;
}

const PublicAuctionDetailsCard: React.FC<PublicAuctionDetailsCardProps> = ({
  assetType,
  areaSqFt,
  reservePrice,
  emd,
  bank,
  locality,
  city,
  state,
  startDate,
  applicationDeadLine,
  auctionId,
  isFav,
  images
}) => {
  const [fav, setFav] = useState<boolean>(isFav);
  const { user } = useUser();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setFav(isFav);
  }, [isFav]);

  const addTofav = async () => {
    if (!user.isLogin) {
      return router.push("/login");
    }
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_API}auction/favourite/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auctionId: auctionId,
        }),
      });
      const data = await response.json();
      setFav(data.statusCode == 200 ? false : true);
    } catch (error) {
      console.log(error, "add to fav error");
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (width - 40));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.card}>
      {images?.length > 0 ? (
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={50}
          >
            {images?.map((img, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => router.push({
                pathname: `/fullScreenImageView`,
                params: { images: JSON.stringify(images) },
              })}>
                <Image source={{ uri: img }} style={styles.image} />
              </TouchableOpacity>))}
          </ScrollView>
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
          <View style={styles.overlayIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={addTofav} activeOpacity={0.8}>
              {fav ? (
                <FontAwesome name="heart" size={18} color="#ef4444" />
              ) : (
                <FontAwesome5 name="heart" size={18} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onShare({ id: auctionId, assetType, city })}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="share-alt" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.iconButtonOutline} onPress={addTofav} activeOpacity={0.8}>
            {fav ? (
              <FontAwesome name="heart" size={18} color="#ef4444" />
            ) : (
              <FontAwesome5 name="heart" size={18} color="#64748b" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButtonOutline}
            onPress={() => onShare({ id: auctionId, assetType, city })}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="share-alt" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.headerInfo}>
        <View style={styles.titleSection}>
          <Text style={styles.assetType}>{assetType || "Auction Asset"}</Text>
          <View style={styles.locationBadge}>
            <FontAwesome5 name="map-marker-alt" size={10} color="#64748b" />
            <Text style={styles.locationBadgeText}>{city}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>RESERVE PRICE</Text>
          <Text style={styles.reservePrice}>₹ {reservePrice || "NA"}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.gridContainer}>
        <DetailField
          icon="ruler-combined"
          title="Area"
          text={`${areaSqFt || "N/A"} sqft`}
        />
        <DetailField 
          icon="coins" 
          title="EMD Amount" 
          text={`₹ ${emd || "N/A"}`} 
        />
        <DetailField 
          icon="university" 
          title="Auction Bank" 
          text={`${bank || "N/A"}`} 
        />
        <DetailField
          icon="map-pin"
          title="Detailed Location"
          text={`${locality || ""}${locality ? "," : ""} ${city}, ${state}`}
        />
        <DetailField
          icon="calendar-alt"
          title="Auction Start Date"
          text={`${formateDate(startDate) || "N/A"}`}
        />
        <DetailField
          icon="clock"
          title="Application Deadline"
          text={`${applicationDeadLine ? formateDate(applicationDeadLine) : "N/A"}`}
        />
      </View>
    </View>
  );
};

const DetailField = ({ icon, text, title }) => (
  <View style={styles.detailRow}>
    <View style={styles.iconBox}>
      <FontAwesome5 name={icon} size={15} color={APP_COLOR.primary} />
    </View>
    <View style={styles.fieldTextContainer}>
      <Text style={styles.fieldTitle}>{title}</Text>
      <Text style={styles.fieldValue} numberOfLines={2}>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
    position: "relative",
    marginBottom: 16,
  },
  image: {
    width: width - 56, // Adjusted for card padding (16*2=32) and horizontal margins (12*2=24)
    height: 220,
    resizeMode: "cover",
  },
  pagination: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  paginationText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  overlayIcons: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
  },
  iconButtonOutline: {
    width: 36,
    height: 36,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  titleSection: {
    flex: 1,
    gap: 6,
  },
  assetType: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: 28,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    gap: 6,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  reservePrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10b981",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },
  gridContainer: {
    gap: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(0, 123, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldTextContainer: {
    flex: 1,
    gap: 2,
  },
  fieldTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
});
export default PublicAuctionDetailsCard;
