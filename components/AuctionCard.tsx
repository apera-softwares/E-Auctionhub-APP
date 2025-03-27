import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { APP_COLOR } from "constants/Colors";
import { formateDate, onShare } from "constants/staticData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API } from "constants/api";
import { useEffect, useState } from "react";
import { useUser } from "context/UserContextProvider";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 10;

export const AuctionCard = ({ data: auction }) => {
  const router = useRouter();
  const [fav, setFav] = useState<boolean>(auction.favourite);
  const { user } = useUser();

  useEffect(() => {
    setFav(auction.favourite);
  }, [auction.favourite]);

  const addTofav = async () => {
    if (!user.isLogin) {
      return router.push("/login");
    }
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
          auctionId: auction.id,
        }),
      });

      const data = await response.json();
      setFav(data.statusCode == 200 ? false : true);
    } catch (error) {
      console.log(error, "add to fav error");
    }
  };

  const incrementAuctionViewCount = async () => {
    const token = await AsyncStorage.getItem("token");
    let headers: any = {};
    try {
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const URL = `${BACKEND_API}auction/view/${auction.id}`;
      const response = await fetch(URL, {
        method: "POST",
        headers,
      });
      console.log(response, "increment count");
    } catch (error) {
      console.log("error while updating auction view count", error);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => {
      incrementAuctionViewCount();
      router.push({
        pathname: `/auctionDetails`,
        params: { auctionId: auction.id },
      });
    }}>
      <View style={styles.imageContainer} >
        {auction?.imageUrl.length > 0 ? <Image
          source={{ uri: auction.imageUrl[0] }}
          style={styles.image}
          resizeMode="cover"
        /> :
          <Image
            source={
              auction.assetType === "Flat"
                ? require("assets/images/assetsTypes/apartment.png")
                : auction.assetType === "House"
                  ? require("assets/images/assetsTypes/home.png")
                  : auction.assetType === "Bungalow"
                    ? require("assets/images/assetsTypes/bungalow.png")
                    : auction.assetType === "Shop"
                      ? require("assets/images/assetsTypes/shop.png")
                      : auction.assetType === "Office"
                        ? require("assets/images/assetsTypes/office.png")
                        : require("assets/images/assetsTypes/land.png")
            }
            style={styles.image}
            resizeMode="contain"
          />
        }

        <TouchableOpacity style={styles.favButton} onPress={addTofav}>
          {fav ? (
            <FontAwesome name="heart" size={15} color="red" />
          ) : (
            <FontAwesome name="heart-o" size={15} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() =>
            onShare({
              id: auction?.id,
              assetType: auction?.assetType,
              city: auction?.city,
            })
          }
        >
          <FontAwesome name="share-alt" size={15} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.assetType}>{auction.assetType || "Others"}</Text>
        <Text style={styles.price}>
          <FontAwesome name="rupee" size={14} color="#28a745" />{" "}
          {auction?.reservePrice?.toLocaleString()}
        </Text>
        <Text style={styles.text}>
          <FontAwesome6 name="location-dot" size={14} color="#555" />{" "}
          {auction.city}
        </Text>
        <Text style={styles.text}>
          <FontAwesome name="bank" size={13} color="#555" />{" "}
          {auction?.bank?.slice(0, 18) || "NA"}
          {"..."}
        </Text>

        <Text style={styles.date}>
          <Fontisto name="date" size={12} color="#333" />{" "}
          <Text style={{ fontWeight: "bold" }}>
            {formateDate(auction.startDate) || "NA"}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          incrementAuctionViewCount();
          router.push({
            pathname: `/auctionDetails`,
            params: { auctionId: auction.id },
          });
        }}
      >
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 9,
    margin: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D3D3D3",
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
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 6,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    width: 28,
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
    marginVertical: 3,
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
    borderWidth: 1,
    borderColor: APP_COLOR.primary,
    paddingVertical: 6,
    // paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  buttonText: {
    color: APP_COLOR.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
});
