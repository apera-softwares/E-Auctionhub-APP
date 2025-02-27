import { APP_COLOR } from "constants/Colors";
import { useEffect, useState } from "react";
import { View, Text, Image } from "tamagui";
import {
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BACKEND_API } from "constants/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import LoaderSkelton from "components/LoaderSkelton";
import RenderFooter from "components/NoAuctionFoundCard";
import { formateDate } from "constants/staticData";
import { APP_LINK } from "constants/constant";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 18;

export default function AuctionScreen() {
  const { cityId, assetTypeId } = useLocalSearchParams() as any;
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const LIMIT = 10;
  const router = useRouter();

  const fetchAuctions = async (pageNumber = 1, isRefreshing = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const URL = `${BACKEND_API}auction/search?assetTypeId=${assetTypeId}&cityId=${cityId}&page=${pageNumber}&limit=${LIMIT}`;
      const response = await fetch(URL);
      const data = await response.json();

      if (data?.statusCode === 200) {
        setAuctions((prev) =>
          isRefreshing ? data?.data : [...prev, ...data?.data]
        );
        setLastPage(data?.lastPage);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAuctions(1, true);
  }, [cityId, assetTypeId]);

  const loadMore = () => {
    if (!loading && page < lastPage) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchAuctions(nextPage);
        return nextPage;
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchAuctions(1, true);
  };

  const renderFooter = () => (!loading ? <RenderFooter /> : null);

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: "App link",
        message: `Install E-AuctionsHub App to hire manpower in easy way. App Link: ${APP_LINK}`,
        url: APP_LINK,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item: auction }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={
            auction.assetType === "Flat"
              ? require("assets/images/assetsTypes/flat.png")
              : auction.assetType === "House"
              ? require("assets/images/assetsTypes/house.png")
              : auction.assetType === "Bungalow"
              ? require("assets/images/assetsTypes/banglow.jpg")
              : require("assets/images/assetsTypes/land.jpg")
          }
          style={styles.image}
          resizeMode="contain"
        />

        {/* Favorite Button */}
        <TouchableOpacity style={styles.favButton}>
          <FontAwesome name="heart-o" size={18} color="white" />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <FontAwesome name="share-alt" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.assetType}>{auction.assetType || "Others"}</Text>
        <Text style={styles.text}>
          <FontAwesome6 name="location-dot" size={14} color="#555" />{" "}
          {auction.city}
        </Text>
        <Text style={styles.text}>
          <FontAwesome name="bank" size={13} color="#555" /> {auction.bank}
        </Text>
        <Text style={styles.price}>
          <FontAwesome name="rupee" size={14} color="#28a745" />{" "}
          {auction.reservePrice.toLocaleString()}
        </Text>
        <Text style={styles.date}>
          <Fontisto name="date" size={12} color="#333" />{" "}
          <Text style={{ fontWeight: "bold" }}>
            {formateDate(auction.startDate)}
          </Text>
        </Text>
        {auction.applicationDeadLine && (
          <Text style={styles.deadline}>
            ⏳ {formateDate(auction.applicationDeadLine)}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: `/auctionDetails`,
            params: { auctionId: auction.id },
          })
        }
      >
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={auctions}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={loading ? <LoaderSkelton /> : null}
        ListEmptyComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 80, // Reduced height
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favButton: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 6,
    borderRadius: 50,
  },
  shareButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 6,
    borderRadius: 50,
  },
  textContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  assetType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: "#555",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28a745",
    marginVertical: 5,
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  deadline: {
    fontSize: 12,
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: APP_COLOR.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
