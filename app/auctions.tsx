import { useEffect, useState } from "react";
import { View, Text } from "tamagui";
import { TouchableOpacity, StyleSheet, FlatList, Modal } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BACKEND_API } from "constants/api";
import LoaderSkelton from "components/LoaderSkelton";
import RenderFooter from "components/NoAuctionFoundCard";
import { sortList } from "constants/staticData";
import { AntDesign } from "@expo/vector-icons";
import { AuctionCard } from "components/AuctionCard";
import { APP_COLOR } from "constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuctionScreen() {
  const {
    cityId,
    assetTypeId,
    bankId,
    minPrice,
    maxPrice,
    assetTypeName,
    cityName,
  } = useLocalSearchParams() as any;
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const LIMIT = 10;
  const [totalAuction, setTotalAuction] = useState(0);
  const [sort, setSort] = useState("search");
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchAuctions = async (pageNumber = 1, isRefreshing = false) => {
    const token = await AsyncStorage.getItem("token");
    console.log(token, "token, token");
    if (loading) return;

    let headers: any = {};
    try {
      setLoading(true);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const URL = `${BACKEND_API}auction/${sort}?assetTypeId=${assetTypeId}&bankId=${bankId}&cityId=${cityId}&minResPrice=${minPrice}&maxResPrice=${maxPrice}&page=${pageNumber}&limit=${LIMIT}`;
      const response = await fetch(URL, {
        headers,
      });

      const data = await response.json();

      console.log(data, "auction data");

      if (data?.statusCode === 200) {
        setAuctions((prev) =>
          isRefreshing ? data?.data : [...prev, ...data?.data]
        );
        setLastPage(data?.lastPage);
        setTotalAuction(data.totalAuctions);
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
  }, [cityId, assetTypeId, bankId, minPrice, maxPrice, sort]);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalAuctions}>
          <Text style={{ color: APP_COLOR.primary, fontSize: 18 }}>
            {totalAuction}
          </Text>{" "}
          {cityName && assetTypeName
            ? `Auctions ${assetTypeName} found in ${cityName}`
            : cityName
            ? `Auctions found in ${cityName}`
            : assetTypeName
            ? `Auctions found in ${assetTypeName}`
            : "Total Auction found"}
        </Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setModalVisible(true)}
        >
          <Text>Sort By:</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={styles.modalOverlay}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <FlatList
              data={sortList}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSort(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={auctions}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <AuctionCard key={index} data={item} />
        )}
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
    paddingHorizontal: 10,
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
    paddingVertical: 8,
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
    width: 90,
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
