import { useEffect, useState } from "react";
import { View, Text } from "tamagui";
import { TouchableOpacity, StyleSheet, FlatList, Modal } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BACKEND_API } from "constants/api";
import LoaderSkelton from "components/LoaderSkelton";
import RenderFooter from "components/NoAuctionFoundCard";
import { sortList } from "constants/staticData";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { AuctionCard } from "components/AuctionCard";
import { APP_COLOR } from "constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "context/UserContextProvider";

export default function AuctionScreen() {
  const {
    cityId,
    assetTypeId,
    bankId,
    minPrice,
    maxPrice,
    assetTypeName,
    cityName,
    localityName
  } = useLocalSearchParams() as any;
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const LIMIT = 10;
  const [totalAuction, setTotalAuction] = useState(0);
  const [sort, setSort] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useUser();
  const [numColumns, setNumColumns] = useState(2);

  const fetchAuctions = async (pageNumber = 1, isRefreshing = false) => {
    const token = await AsyncStorage.getItem("token");
    console.log(token, "token");
    if (loading) return;

    let headers: any = {};
    try {
      setLoading(true);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const URL = `${BACKEND_API}auction/search?${sort}&assetTypeId=${assetTypeId}&bankId=${bankId}&cityId=${cityId}&locality=${localityName}&minResPrice=${minPrice}&maxResPrice=${maxPrice}&page=${pageNumber}&limit=${LIMIT}`;
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
  }, [cityId, assetTypeId, bankId, minPrice, maxPrice, sort, localityName]);

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
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleRow}>
          <View style={styles.titleTextContainer}>
            <Text style={styles.headerTitle}>
              <Text style={styles.highlightCount}>{totalAuction}</Text>{" "}
              {cityName && assetTypeName
                ? `${assetTypeName} in ${cityName}`
                : cityName
                  ? `Properties in ${cityName}`
                  : assetTypeName
                    ? `${assetTypeName} Properties`
                    : "Properties Found"}
            </Text>
            <Text style={styles.headerSubtitle}>Verified bank auction listings</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-vertical-outline" size={16} color={APP_COLOR.primary} />
            <Text style={styles.sortButtonText}>Sort By</Text>
            <AntDesign name="down" size={12} color="#64748b" style={{ marginLeft: 2 }} />
          </TouchableOpacity>

          <View style={styles.switcherContainer}>
            <TouchableOpacity
              style={[
                styles.switcherButton,
                numColumns === 1 && styles.switcherButtonActive,
              ]}
              onPress={() => setNumColumns(1)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="list-outline"
                size={16}
                color={numColumns === 1 ? APP_COLOR.primary : "#64748b"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switcherButton,
                numColumns === 2 && styles.switcherButtonActive,
              ]}
              onPress={() => setNumColumns(2)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="grid-outline"
                size={16}
                color={numColumns === 2 ? APP_COLOR.primary : "#64748b"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switcherButton,
                numColumns === 3 && styles.switcherButtonActive,
              ]}
              onPress={() => setNumColumns(3)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="apps-outline"
                size={16}
                color={numColumns === 3 ? APP_COLOR.primary : "#64748b"}
              />
            </TouchableOpacity>
          </View>
        </View>
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
        key={numColumns}
        data={auctions}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <AuctionCard data={item} numColumns={numColumns} />
        )}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={[
          styles.flatListContent,
          {
            paddingHorizontal: numColumns === 1 ? 0 : numColumns === 2 ? 8 : 9,
          },
        ]}
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
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  row: {
    justifyContent: "flex-start",
  },
  flatListContent: {
    paddingVertical: 8,
  },
  headerContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 20,
  },
  highlightCount: {
    color: APP_COLOR.primary,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    backgroundColor: "#fff",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  switcherContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  switcherButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  },
  switcherButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  itemText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  closeButton: {
    padding: 14,
    alignItems: "center",
    backgroundColor: APP_COLOR.primary,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: APP_COLOR.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});