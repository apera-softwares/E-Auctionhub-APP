import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API } from "constants/api";
import LoaderSkelton from "components/LoaderSkelton";
import { FavAuctionCard } from "components/FavAuctionCard";
import { MaterialIcons } from "@expo/vector-icons";

const favourite = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    const token = await AsyncStorage.getItem("token");

    if (loading) return;
    try {
      setLoading(true);
      const URL = `${BACKEND_API}auction/favourites`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      console.log(data.data, "auction data");

      if (data?.statusCode === 200) {
        setAuctions((prev) => data?.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () =>
    !loading ? (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: 20,
          marginTop: 20,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          width: "90%",
          alignSelf: "center",
          marginBottom: 5,
        }}
      >
        <MaterialIcons name="gavel" size={50} color="#888" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginTop: 10,
          }}
        >
          No Favourtie Auctions
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#666",
            textAlign: "center",
            marginTop: 5,
          }}
        >
          search Auctions of your whishlist and add to favourite.
        </Text>
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <FlatList
        data={auctions}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <FavAuctionCard
            key={index}
            data={item}
            fetchAuction={() => fetchAuctions()}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <LoaderSkelton /> : null}
        ListEmptyComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  row: {
    justifyContent: "space-between",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  totalAuctions: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: "75%",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: 100,
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default favourite;
