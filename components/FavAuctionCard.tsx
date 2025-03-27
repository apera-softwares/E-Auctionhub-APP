import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { APP_COLOR } from "constants/Colors";
import { formateDate, onShare } from "constants/staticData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API } from "constants/api";
import { useEffect, useState } from "react";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 18;

export const FavAuctionCard = ({ data: auctionData, fetchAuction }) => {
  console.log(auctionData, "auctionData");
  const router = useRouter();
  const [fav, setFav] = useState<boolean>(true);

  useEffect(() => {
    setFav(auctionData.auctionData.favourite);
  }, [auctionData.auctionData.favourite]);

  const addTofav = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(token, "token");
    try {
      const response = await fetch(`${BACKEND_API}auction/favourite/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auctionId: auctionData?.auctionId,
        }),
      });

      const data = await response.json();
      setFav(data.statusCode == 200 ? false : true);
      fetchAuction();
    } catch (error) {
      console.log(error, "add to fav error");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {auctionData?.auctionData?.imageUrl?.length > 0 ? <Image
          source={{ uri: auctionData?.auctionData?.imageUrl[0] }}
          style={styles.image}
          resizeMode="cover"
        /> : <Image
          source={
            auctionData.auctionData.assetType === "Flat"
              ? require("assets/images/assetsTypes/apartment.png")
              : auctionData.auctionData.assetType === "House"
                ? require("assets/images/assetsTypes/home.png")
                : auctionData.auctionData.assetType === "Bungalow"
                  ? require("assets/images/assetsTypes/bungalow.png")
                  : auctionData.auctionData.assetType === "Shop"
                    ? require("assets/images/assetsTypes/shop.png")
                    : auctionData.auctionData.assetType === "Office"
                      ? require("assets/images/assetsTypes/office.png")
                      : require("assets/images/assetsTypes/land.png")
          }
          style={styles.image}
          resizeMode="contain"
        />}

        {/* Favorite Button */}
        <TouchableOpacity style={styles.favButton} onPress={addTofav}>
          <AntDesign name="delete" size={18} color="black" />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() =>
            onShare({
              id: auctionData?.auctionId,
              assetType: auctionData?.assetType,
              city: auctionData?.city,
            })
          }
        >
          <FontAwesome name="share-alt" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.assetType}>
          {auctionData.auctionData.assetType || "Others"}
        </Text>
        <Text style={styles.text}>
          <FontAwesome6 name="location-dot" size={14} color="#555" />{" "}
          {auctionData.auctionData.city}
        </Text>
        <Text style={styles.text}>
          <FontAwesome name="bank" size={13} color="#555" />{" "}
          {auctionData.auctionData.bank.slice(0, 16)}
          {"..."}
        </Text>
        <Text style={styles.price}>
          <FontAwesome name="rupee" size={14} color="#28a745" />{" "}
          {auctionData.auctionData?.reservePrice?.toLocaleString()}
        </Text>
        <Text style={styles.date}>
          <Fontisto name="date" size={12} color="#333" />{" "}
          <Text style={{ fontWeight: "bold" }}>
            {formateDate(auctionData.auctionData.startDate)}
          </Text>
        </Text>
        {auctionData.auctionData.applicationDeadLine && (
          <Text style={styles.deadline}>
            ⏳ {formateDate(auctionData.auctionData.applicationDeadLine)}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: `/auctionDetails`,
            params: { auctionId: auctionData.auctionId },
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
    position: "relative",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
