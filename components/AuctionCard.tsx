import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { APP_COLOR } from "constants/Colors";
import { formateDate, onShare } from "constants/staticData";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 18;

export const AuctionCard = ({ data: auction }) => {
  const router = useRouter();

  return (
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
          {auction?.reservePrice?.toLocaleString()}
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
};

const styles = StyleSheet.create({
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
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ededed",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
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
    paddingHorizontal: 5,
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
