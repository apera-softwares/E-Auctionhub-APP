import { APP_COLOR } from "constants/Colors";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "tamagui";
import { TouchableOpacity, StyleSheet } from "react-native";
import dayjs from "dayjs"; // For calculating auction deadline
import { useLocalSearchParams } from "expo-router";
import { BACKEND_API } from "constants/api";

export default function AuctionScreen() {
  const { cityId, assetTypeId } = useLocalSearchParams() as any;
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [auctions, setAuctions] = useState([]);
  const LIMIT = 10;

  const getDaysLeft = (auctionDate: string) => {
    const today = dayjs();
    const auctionDay = dayjs(auctionDate);
    const daysLeft = auctionDay.diff(today, "day");
    return daysLeft > 0 ? `${daysLeft} days left` : "Auction ended";
  };

  const fetchAuctions = async (
    cityId: string,
    assetTypeId: string,
    page: number
  ) => {
    try {
      setLoading(true);

      const URL = `${BACKEND_API}auction/search?assetTypeId=${assetTypeId}&cityId=${cityId}&page=${page}&limit=${LIMIT}`;

      const response = await fetch(URL);
      const data = await response.json();
      //   console.log(data?.data, "data?.data");

      if (data?.statusCode === 200) {
        setAuctions(data?.data);
        setLastPage(data?.lastPage);
      }
      //   else {
      //     toast.error(data?.message);
      //   }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions(cityId, assetTypeId, 1);
  }, [cityId, assetTypeId]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {auctions.map((auction: any) => (
            <View key={auction.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={
                    auction.assetType === "Flat"
                      ? require("assets/images/assetsTypes/flat.png")
                      : require("assets/images/assetsTypes/land.jpg")
                  }
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.assetType}>{auction.assetType}</Text>
                  <Text style={styles.text}>📍 {auction.city}</Text>
                  <Text style={styles.text}>🏦 {auction.bank}</Text>
                  <Text style={styles.price}>
                    💰 ₹{auction.reservePrice.toLocaleString()}
                  </Text>
                  <Text style={styles.date}>
                    🗓 Auction Date:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {dayjs(auction.startDate).format("MMM DD, YYYY")}
                    </Text>
                  </Text>
                  {auction.applicationDeadLine && (
                    <Text style={styles.deadline}>
                      ⏳ Deadline Date:{" "}
                      {dayjs(auction.applicationDeadLine).format(
                        "MMM DD, YYYY"
                      )}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View Auction</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  assetType: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    marginVertical: 5,
  },
  date: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  deadline: {
    fontSize: 14,
    color: "red",
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: APP_COLOR.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
