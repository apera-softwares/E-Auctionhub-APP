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

export const AuctionCard = ({ data: auction, numColumns = 2 }) => {
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

  // Dynamically calculate width based on layout
  let cardWidth = width - 24;
  if (numColumns === 2) {
    cardWidth = (width - 32) / 2;
  } else if (numColumns === 3) {
    cardWidth = (width - 36) / 3;
  }

  // --- 1 Column Layout (Row style) ---
  if (numColumns === 1) {
    return (
      <TouchableOpacity
        style={[styles.cardHorizontal, { width: cardWidth }]}
        onPress={() => {
          incrementAuctionViewCount();
          router.push({
            pathname: `/auctionDetails`,
            params: { auctionId: auction.id },
          });
        }}
      >
        <View style={styles.imageContainerHorizontal}>
          {auction?.imageUrl.length > 0 ? (
            <Image
              source={{ uri: auction.imageUrl[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
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
          )}

          <TouchableOpacity style={styles.favButton} onPress={addTofav}>
            {fav ? (
              <FontAwesome name="heart" size={13} color="red" />
            ) : (
              <FontAwesome name="heart-o" size={13} color="white" />
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
            <FontAwesome name="share-alt" size={13} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.textContainerHorizontal}>
          <View style={styles.rowJustified}>
            <Text style={styles.assetTypeHorizontal} numberOfLines={1}>
              {auction.assetType || "Others"}
            </Text>
            <Text style={styles.cityBadgeHorizontal} numberOfLines={1}>
              <FontAwesome6 name="location-dot" size={11} color="#64748b" /> {auction.city}
            </Text>
          </View>

          <Text style={styles.priceHorizontal}>
            <FontAwesome name="rupee" size={15} color="#10b981" />{" "}
            {auction?.reservePrice?.toLocaleString()}
          </Text>

          <Text style={styles.bankTextHorizontal} numberOfLines={1}>
            <Image
              source={{ uri: `https://media.aperasoftwares.com/uploads/auction/bank-${auction.bankId}.png` }}
              style={styles.bankLogoHorizontal}
              resizeMode="contain"
            />{" "}
            {auction?.bank || "NA"}
          </Text>

          <View style={styles.bottomRowHorizontal}>
            <Text style={styles.dateHorizontal}>
              <Fontisto name="date" size={11} color="#64748b" />{" "}
              <Text style={{ fontWeight: "600", color: "#334155" }}>
                {formateDate(auction.startDate) || "NA"}
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.buttonHorizontal}
              onPress={() => {
                router.push({
                  pathname: `/auctionDetails`,
                  params: { auctionId: auction.id },
                });
              }}
            >
              <Text style={styles.buttonTextHorizontal}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // --- 2 Column Layout (Standard Grid style) ---
  if (numColumns === 2) {
    return (
      <TouchableOpacity
        style={[styles.card2Col, { width: cardWidth }]}
        onPress={() => {
          incrementAuctionViewCount();
          router.push({
            pathname: `/auctionDetails`,
            params: { auctionId: auction.id },
          });
        }}
      >
        <View style={styles.imageContainer2Col}>
          {auction?.imageUrl.length > 0 ? (
            <Image
              source={{ uri: auction.imageUrl[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
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
          )}

          <TouchableOpacity style={styles.favButton} onPress={addTofav}>
            {fav ? (
              <FontAwesome name="heart" size={12} color="red" />
            ) : (
              <FontAwesome name="heart-o" size={12} color="white" />
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
            <FontAwesome name="share-alt" size={12} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.assetType2Col} numberOfLines={1}>
            {auction.assetType || "Others"}
          </Text>
          <Text style={styles.price2Col} numberOfLines={1}>
            <FontAwesome name="rupee" size={13} color="#10b981" />{" "}
            {auction?.reservePrice?.toLocaleString()}
          </Text>
          <Text style={styles.text2Col} numberOfLines={1}>
            <FontAwesome6 name="location-dot" size={11} color="#64748b" />{" "}
            {auction.city}
          </Text>
          <Text style={styles.text2Col} numberOfLines={1}>
            <Image
              source={{
                uri: `https://media.aperasoftwares.com/uploads/auction/bank-${auction.bankId}.png`,
              }}
              style={styles.bankLogoSmall}
              resizeMode="contain"
            />{" "}
            {auction?.bank || "NA"}
          </Text>

          <Text style={styles.date2Col} numberOfLines={1}>
            <Fontisto name="date" size={10} color="#64748b" />{" "}
            <Text style={{ fontWeight: "600", color: "#475569" }}>
              {formateDate(auction.startDate) || "NA"}
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button2Col}
          onPress={() => {
            router.push({
              pathname: `/auctionDetails`,
              params: { auctionId: auction.id },
            });
          }}
        >
          <Text style={styles.buttonText2Col}>View</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // --- 3 Column Layout (Dense Grid style) ---
  return (
    <TouchableOpacity
      style={[styles.card3Col, { width: cardWidth }]}
      onPress={() => {
        incrementAuctionViewCount();
        router.push({
          pathname: `/auctionDetails`,
          params: { auctionId: auction.id },
        });
      }}
    >
      <View style={styles.imageContainer3Col}>
        {auction?.imageUrl.length > 0 ? (
          <Image
            source={{ uri: auction.imageUrl[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
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
        )}

        <TouchableOpacity style={styles.favButton3Col} onPress={addTofav}>
          {fav ? (
            <FontAwesome name="heart" size={9} color="red" />
          ) : (
            <FontAwesome name="heart-o" size={9} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton3Col}
          onPress={() =>
            onShare({
              id: auction?.id,
              assetType: auction?.assetType,
              city: auction?.city,
            })
          }
        >
          <FontAwesome name="share-alt" size={9} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer3Col}>
        <Text style={styles.assetType3Col} numberOfLines={1}>
          {auction.assetType || "Others"}
        </Text>
        <Text style={styles.price3Col} numberOfLines={1}>
          <FontAwesome name="rupee" size={10} color="#10b981" />{" "}
          {auction?.reservePrice?.toLocaleString()}
        </Text>
        <Text style={styles.text3Col} numberOfLines={1}>
          <FontAwesome6 name="location-dot" size={9} color="#64748b" />{" "}
          {auction.city}
        </Text>
        <Text style={styles.text3Col} numberOfLines={1}>
          <Image
            source={{
              uri: `https://media.aperasoftwares.com/uploads/auction/bank-${auction.bankId}.png`,
            }}
            style={styles.bankLogoExtraSmall}
            resizeMode="contain"
          />{" "}
          {auction?.bank || "NA"}
        </Text>
        <Text style={styles.date3Col} numberOfLines={1}>
          <Fontisto name="date" size={8} color="#64748b" />{" "}
          <Text style={{ fontWeight: "600", color: "#475569" }}>
            {formateDate(auction.startDate) || "NA"}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  favButton: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    padding: 5,
    borderRadius: 50,
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    padding: 5,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    height: 24,
    width: 24,
  },
  textContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 2,
    marginTop: 4,
  },
  // --- 1 Column Styles ---
  cardHorizontal: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imageContainerHorizontal: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  textContainerHorizontal: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  rowJustified: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assetTypeHorizontal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  cityBadgeHorizontal: {
    fontSize: 11,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  priceHorizontal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10b981",
    marginVertical: 1,
  },
  bankTextHorizontal: {
    fontSize: 11,
    color: "#475569",
    marginVertical: 2,
  },
  bankLogoHorizontal: {
    width: 12,
    height: 12,
    borderWidth: 0.2,
    borderColor: "#cbd5e1",
    borderRadius: 1,
  },
  bottomRowHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  dateHorizontal: {
    fontSize: 10,
    color: "#64748b",
  },
  buttonHorizontal: {
    borderWidth: 1,
    borderColor: APP_COLOR.primary,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  buttonTextHorizontal: {
    color: APP_COLOR.primary,
    fontWeight: "700",
    fontSize: 11,
  },

  // --- 2 Column Styles ---
  card2Col: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imageContainer2Col: {
    width: "100%",
    height: 95,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  assetType2Col: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 4,
  },
  price2Col: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10b981",
    marginVertical: 2,
  },
  text2Col: {
    fontSize: 11,
    color: "#475569",
    marginVertical: 1,
  },
  date2Col: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 1,
  },
  button2Col: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: APP_COLOR.primary,
    paddingVertical: 5,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonText2Col: {
    color: APP_COLOR.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  bankLogoSmall: {
    width: 12,
    height: 12,
    borderWidth: 0.2,
    borderColor: "#cbd5e1",
    borderRadius: 1,
  },

  // --- 3 Column Styles ---
  card3Col: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    marginVertical: 4,
    marginHorizontal: 3,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imageContainer3Col: {
    width: "100%",
    height: 65,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  textContainer3Col: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 2,
    marginTop: 4,
  },
  assetType3Col: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1e293b",
  },
  price3Col: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10b981",
    marginVertical: 1,
  },
  text3Col: {
    fontSize: 9,
    color: "#64748b",
    marginVertical: 1,
  },
  date3Col: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 1,
  },
  favButton3Col: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    padding: 3,
    borderRadius: 50,
    height: 18,
    width: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton3Col: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    padding: 3,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    height: 18,
    width: 18,
  },
  bankLogoExtraSmall: {
    width: 10,
    height: 10,
    borderWidth: 0.1,
    borderColor: "#cbd5e1",
    borderRadius: 1,
  },
});
