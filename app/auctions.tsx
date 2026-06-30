import { useEffect, useState, useRef } from "react";
import { View, Text } from "tamagui";
import { TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, ScrollView, Animated, Dimensions } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { LinearGradient } from "expo-linear-gradient";
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

  const { width: screenWidth } = Dimensions.get("window");
  const DRAWER_WIDTH = Math.min(screenWidth * 0.85, 340);

  // ── Filter state ──────────────────────────────────────
  const [filterOpen, setFilterOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(1)).current; // 1 = closed (right), 0 = open (on-screen)

  const openFilter = () => {
    setFilterOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start((finished) => {
      if (finished) {
        setFilterOpen(false);
      }
    });
  };

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  const [fCity, setFCity] = useState(cityId ?? "");
  const [fCityName, setFCityName] = useState(cityName ?? "");
  const [fBank, setFBank] = useState(bankId ?? "");
  const [fAssetType, setFAssetType] = useState(assetTypeId ?? "");
  const [fAssetTypeName, setFAssetTypeName] = useState(assetTypeName ?? "");
  const [fLocality, setFLocality] = useState(localityName ?? "");
  const [fMinPrice, setFMinPrice] = useState(minPrice ?? "");
  const [fMaxPrice, setFMaxPrice] = useState(maxPrice ?? "");
  const [allCities, setAllCities] = useState([]);
  const [allBanks, setAllBanks] = useState([]);
  const [allAssetTypes, setAllAssetTypes] = useState([]);

  const activeCount = [
    fAssetTypeName,
    fCityName,
    fBank,
    fLocality,
    (fMinPrice || fMaxPrice) ? "price" : ""
  ].filter(val => val && val !== "undefined" && val !== "null" && String(val).trim() !== "").length;

  useEffect(() => {
    fetchCities(); fetchBanks(); fetchAssetsType();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await fetch(`${BACKEND_API}user/cities`);
      if (res.ok) { const d = await res.json(); setAllCities(d.cities.map((c: any) => ({ label: c?.name, value: c?.id }))); }
    } catch (e) { }
  };
  const fetchBanks = async () => {
    try {
      const res = await fetch(`${BACKEND_API}auction/banks`);
      if (res.ok) { const d = await res.json(); setAllBanks(d.banks.map((b: any) => ({ label: b?.name, value: b?.id }))); }
    } catch (e) { }
  };
  const fetchAssetsType = async () => {
    try {
      const res = await fetch(`${BACKEND_API}auction/asset-types`);
      if (res.ok) { const d = await res.json(); setAllAssetTypes([{ label: "All Types", value: "" }, ...d.assetTypes.map((a: any) => ({ label: a?.name, value: a?.id }))]); }
    } catch (e) { }
  };

  const removeSingleFilter = (key: string) => {
    let newCity = fCity;
    let newCityName = fCityName;
    let newBank = fBank;
    let newAssetType = fAssetType;
    let newAssetTypeName = fAssetTypeName;
    let newLocality = fLocality;
    let newMinPrice = fMinPrice;
    let newMaxPrice = fMaxPrice;

    if (key === "assetType") {
      newAssetType = "";
      newAssetTypeName = "";
      setFAssetType("");
      setFAssetTypeName("");
    } else if (key === "city") {
      newCity = "";
      newCityName = "";
      setFCity("");
      setFCityName("");
    } else if (key === "bank") {
      newBank = "";
      setFBank("");
    } else if (key === "locality") {
      newLocality = "";
      setFLocality("");
    } else if (key === "price") {
      newMinPrice = "";
      newMaxPrice = "";
      setFMinPrice("");
      setFMaxPrice("");
    }

    setPage(1);
    fetchAuctions(1, true, {
      city: newCity,
      bank: newBank,
      assetType: newAssetType,
      locality: newLocality,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice
    });
  };

  const clearFilters = () => {
    setFCity(""); setFCityName(""); setFBank("");
    setFAssetType(""); setFAssetTypeName("");
    setFLocality(""); setFMinPrice(""); setFMaxPrice("");
    setPage(1);
    fetchAuctions(1, true, {
      city: "",
      bank: "",
      assetType: "",
      locality: "",
      minPrice: "",
      maxPrice: ""
    });
  };

  const applyFilters = () => {
    closeFilter();
    setPage(1);
    fetchAuctions(1, true);
  };

  const fetchAuctions = async (pageNumber = 1, isRefreshing = false, overrideFilters?: any) => {
    const token = await AsyncStorage.getItem("token");
    console.log(token, "token");
    if (loading) return;

    let headers: any = {};
    try {
      setLoading(true);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const city = overrideFilters ? overrideFilters.city : fCity;
      const bank = overrideFilters ? overrideFilters.bank : fBank;
      const assetType = overrideFilters ? overrideFilters.assetType : fAssetType;
      const locality = overrideFilters ? overrideFilters.locality : fLocality;
      const minPriceVal = overrideFilters ? overrideFilters.minPrice : fMinPrice;
      const maxPriceVal = overrideFilters ? overrideFilters.maxPrice : fMaxPrice;

      const URL = `${BACKEND_API}auction/search?${sort}&assetTypeId=${assetType}&bankId=${bank}&cityId=${city}&locality=${locality}&minResPrice=${minPriceVal}&maxResPrice=${maxPriceVal}&page=${pageNumber}&limit=${LIMIT}`;
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
    setFCity(cityId ?? "");
    setFCityName(cityName ?? "");
    setFBank(bankId ?? "");
    setFAssetType(assetTypeId ?? "");
    setFAssetTypeName(assetTypeName ?? "");
    setFLocality(localityName ?? "");
    setFMinPrice(minPrice ?? "");
    setFMaxPrice(maxPrice ?? "");

    fetchAuctions(1, true, {
      city: cityId ?? "",
      bank: bankId ?? "",
      assetType: assetTypeId ?? "",
      locality: localityName ?? "",
      minPrice: minPrice ?? "",
      maxPrice: maxPrice ?? "",
    });
  }, [cityId, cityName, assetTypeId, assetTypeName, bankId, minPrice, maxPrice, localityName, sort]);

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

  const fetchAuctionsWithFilters = fetchAuctions;

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


  {/* Active filter chips */}
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

          <TouchableOpacity
            style={[styles.filterButton, (filterOpen || activeCount > 0) && styles.filterButtonActive]}
            onPress={openFilter}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={16} color={(filterOpen || activeCount > 0) ? "#fff" : APP_COLOR.primary} />
            <Text style={[styles.filterButtonText, (filterOpen || activeCount > 0) && { color: "#fff" }]}>Filter</Text>
            {activeCount > 0 && (
              <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{activeCount}</Text></View>
            )}
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

          {activeCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipBar}
          contentContainerStyle={styles.chipBarContent}
        >
          {fAssetTypeName ? (
            <TouchableOpacity style={styles.chip} onPress={() => removeSingleFilter("assetType")}>
              <Ionicons name="business-outline" size={11} color="#1d4ed8" />
              <Text style={styles.chipTxt} numberOfLines={1}>{fAssetTypeName}</Text>
              <Ionicons name="close" size={11} color="#1d4ed8" />
            </TouchableOpacity>
          ) : null}
          {fCityName ? (
            <TouchableOpacity style={styles.chip} onPress={() => removeSingleFilter("city")}>
              <Ionicons name="location-outline" size={11} color="#1d4ed8" />
              <Text style={styles.chipTxt} numberOfLines={1}>{fCityName}</Text>
              <Ionicons name="close" size={11} color="#1d4ed8" />
            </TouchableOpacity>
          ) : null}
          {fBank ? (
            <TouchableOpacity style={styles.chip} onPress={() => removeSingleFilter("bank")}>
              <Ionicons name="card-outline" size={11} color="#1d4ed8" />
              <Text style={styles.chipTxt} numberOfLines={1}>Bank</Text>
              <Ionicons name="close" size={11} color="#1d4ed8" />
            </TouchableOpacity>
          ) : null}
          {fLocality ? (
            <TouchableOpacity style={styles.chip} onPress={() => removeSingleFilter("locality")}>
              <Ionicons name="map-outline" size={11} color="#1d4ed8" />
              <Text style={styles.chipTxt} numberOfLines={1}>{fLocality}</Text>
              <Ionicons name="close" size={11} color="#1d4ed8" />
            </TouchableOpacity>
          ) : null}
          {(fMinPrice || fMaxPrice) ? (
            <TouchableOpacity style={styles.chip} onPress={() => removeSingleFilter("price")}>
              <Ionicons name="pricetag-outline" size={11} color="#1d4ed8" />
              <Text style={styles.chipTxt} numberOfLines={1}>₹{fMinPrice || "0"}–{fMaxPrice || "∞"}</Text>
              <Ionicons name="close" size={11} color="#1d4ed8" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.clearChip} onPress={clearFilters}>
            <Text style={styles.clearChipTxt}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

        {/* ── Sidebar Filter Drawer Modal ──────────────────── */}
        <Modal visible={filterOpen} transparent animationType="none" onRequestClose={closeFilter}>
          <View style={styles.drawerOverlay}>
            <Animated.View style={[styles.drawerBackdrop, { opacity: backdropOpacity }]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={closeFilter} activeOpacity={1} />
            </Animated.View>

            <Animated.View
              style={[
                styles.drawerPanel,
                {
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, DRAWER_WIDTH],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Drawer Header */}
              <View style={styles.drawerHeader}>
                <View>
                  <Text style={styles.drawerTitle}>Filters</Text>
                  <Text style={styles.drawerSubtitle}>
                    {activeCount > 0 ? `${activeCount} active filter${activeCount > 1 ? "s" : ""}` : "Refine your search"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.drawerClose} onPress={closeFilter} activeOpacity={0.7}>
                  <Ionicons name="close" size={20} color="#475569" />
                </TouchableOpacity>
              </View>

              {/* Drawer Body ScrollView */}
              <ScrollView style={styles.drawerBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>Asset Type</Text>
                <Dropdown
                  style={styles.dd} placeholderStyle={styles.ddPh} selectedTextStyle={styles.ddSel}
                  iconStyle={styles.ddIco} containerStyle={styles.ddCont} itemTextStyle={styles.ddItem}
                  itemContainerStyle={styles.ddItemCont} activeColor="rgba(0,123,255,0.08)" inputSearchStyle={styles.ddSearch}
                  data={allAssetTypes} labelField="label" valueField="value" placeholder="Select Asset Type"
                  value={fAssetType}
                  onChange={(item) => { setFAssetType(item?.value); setFAssetTypeName(item?.label); }}
                  renderLeftIcon={() => <Ionicons name="business-outline" size={15} color={APP_COLOR.primary} style={{ marginRight: 8 }} />}
                />

                <Text style={styles.fieldLabel}>Bank</Text>
                <Dropdown
                  style={styles.dd} placeholderStyle={styles.ddPh} selectedTextStyle={styles.ddSel}
                  iconStyle={styles.ddIco} containerStyle={styles.ddCont} itemTextStyle={styles.ddItem}
                  itemContainerStyle={styles.ddItemCont} activeColor="rgba(0,123,255,0.08)" inputSearchStyle={styles.ddSearch}
                  data={allBanks} maxHeight={240} search searchPlaceholder="Search..." labelField="label" valueField="value" placeholder="Select Bank"
                  value={fBank} onChange={(item) => setFBank(item?.value)}
                  renderLeftIcon={() => <Ionicons name="card-outline" size={15} color={APP_COLOR.primary} style={{ marginRight: 8 }} />}
                />

                <Text style={styles.fieldLabel}>City</Text>
                <Dropdown
                  style={styles.dd} placeholderStyle={styles.ddPh} selectedTextStyle={styles.ddSel}
                  iconStyle={styles.ddIco} containerStyle={styles.ddCont} itemTextStyle={styles.ddItem}
                  itemContainerStyle={styles.ddItemCont} activeColor="rgba(0,123,255,0.08)" inputSearchStyle={styles.ddSearch}
                  data={allCities} maxHeight={240} search searchPlaceholder="Search..." labelField="label" valueField="value" placeholder="Select City"
                  value={fCity} onChange={(item) => { setFCity(item?.value); setFCityName(item?.label); }}
                  renderLeftIcon={() => <Ionicons name="location-outline" size={15} color={APP_COLOR.primary} style={{ marginRight: 8 }} />}
                />

                <Text style={styles.fieldLabel}>Locality</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="map-outline" size={15} color={APP_COLOR.primary} style={{ marginRight: 8 }} />
                  <TextInput style={styles.textInput} placeholder="Enter locality" placeholderTextColor="#94a3b8" value={fLocality} onChangeText={setFLocality} />
                </View>

                <Text style={styles.fieldLabel}>Price Range</Text>
                <View style={styles.priceRow}>
                  <View style={[styles.inputRow, { flex: 1 }]}>
                    <Ionicons name="pricetag-outline" size={14} color={APP_COLOR.primary} style={{ marginRight: 6 }} />
                    <TextInput style={styles.textInput} placeholder="Min Price" placeholderTextColor="#94a3b8" keyboardType="numeric" value={fMinPrice} onChangeText={setFMinPrice} />
                  </View>
                  <View style={[styles.inputRow, { flex: 1 }]}>
                    <Ionicons name="pricetag-outline" size={14} color={APP_COLOR.primary} style={{ marginRight: 6 }} />
                    <TextInput style={styles.textInput} placeholder="Max Price" placeholderTextColor="#94a3b8" keyboardType="numeric" value={fMaxPrice} onChangeText={setFMaxPrice} />
                  </View>
                </View>
                <View style={{ height: 40 }} />
              </ScrollView>

              {/* Drawer Footer sticky */}
              <View style={styles.drawerFooter}>
                <TouchableOpacity style={styles.clearBtn} onPress={clearFilters} activeOpacity={0.8}>
                  <Ionicons name="refresh-outline" size={15} color="#64748b" />
                  <Text style={styles.clearBtnTxt}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyWrap} onPress={applyFilters} activeOpacity={0.85}>
                  <LinearGradient colors={["#007bff", "#0056d6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyBtn}>
                    <Ionicons name="checkmark-circle-outline" size={15} color="#fff" />
                    <Text style={styles.applyBtnTxt}>Apply Filters</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>

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
  filterButton: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1.5, borderColor: "#e2e8f0",
    borderRadius: 10, backgroundColor: "#fff",
    gap: 6, flex: 1, justifyContent: "center",
  },
  filterButtonActive: { backgroundColor: APP_COLOR.primary, borderColor: APP_COLOR.primary },
  filterButtonText: { fontSize: 12, fontWeight: "600", color: "#475569" },
  filterBadge: { backgroundColor: "#FFD700", borderRadius: 10, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  filterBadgeText: { fontSize: 9, fontWeight: "800", color: "#0f172a" },
  chipBar: { backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  chipBarContent: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#eff6ff", borderWidth: 1, borderColor: "#bfdbfe", paddingHorizontal: 12, height: 34, borderRadius: 17 },
  chipTxt: { fontSize: 11, color: "#1d4ed8", fontWeight: "600", maxWidth: 120, includeFontPadding: false, textAlignVertical: "center" },
  clearChip: { paddingHorizontal: 12, height: 34, justifyContent: "center", alignItems: "center", borderRadius: 17, backgroundColor: "#fee2e2", borderWidth: 1, borderColor: "#fca5a5" },
  clearChipTxt: { fontSize: 11, color: "#dc2626", fontWeight: "700", includeFontPadding: false, textAlignVertical: "center" },
  // Sidebar drawer filter panel styles
  drawerOverlay: { flex: 1, flexDirection: "row", justifyContent: "flex-end", zIndex: 9999 },
  drawerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  drawerPanel: { width: 310, height: "100%", backgroundColor: "#fff", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, shadowColor: "#0f172a", shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: -4, height: 0 }, elevation: 24 },
  drawerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 45, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  drawerTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  drawerSubtitle: { fontSize: 11, color: "#64748b", marginTop: 2, fontWeight: "500" },
  drawerClose: { padding: 6, borderRadius: 20, backgroundColor: "#f1f5f9" },
  drawerBody: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  drawerFooter: { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9", backgroundColor: "#fff", paddingBottom: 25 },
  fieldLabel: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6, marginTop: 16 },
  dd: { height: 44, borderColor: "rgba(0,123,255,0.15)", borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, backgroundColor: "#f8fafc" },
  ddPh: { color: "#94a3b8", fontSize: 12 },
  ddSel: { color: "#1e293b", fontSize: 12, fontWeight: "500" },
  ddIco: { width: 14, height: 14, tintColor: "#64748b" },
  ddCont: { borderRadius: 12, marginTop: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8, borderColor: "#f1f5f9", borderWidth: 1, backgroundColor: "#fff" },
  ddItem: { color: "#334155", fontSize: 12, fontWeight: "500" },
  ddItemCont: { borderRadius: 8, marginHorizontal: 4, marginVertical: 1 },
  ddSearch: { height: 34, borderRadius: 8, borderColor: "#cbd5e1", fontSize: 12 },
  inputRow: { flexDirection: "row", alignItems: "center", height: 44, borderColor: "rgba(0,123,255,0.15)", borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, backgroundColor: "#f8fafc" },
  textInput: { flex: 1, height: "100%", color: "#1e293b", fontSize: 12, fontWeight: "500" },
  priceRow: { flexDirection: "row", gap: 8 },
  clearBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", height: 44, borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 12, gap: 6, backgroundColor: "#fff" },
  clearBtnTxt: { fontSize: 13, fontWeight: "700", color: "#64748b" },
  applyWrap: { flex: 2, borderRadius: 12, overflow: "hidden", elevation: 4, shadowColor: "#007bff", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  applyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 44, gap: 8 },
  applyBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
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