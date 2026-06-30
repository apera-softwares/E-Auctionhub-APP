import { APP_COLOR } from "constants/Colors";
import { Text, View, YStack } from "tamagui";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, ScrollView, TextInput, Pressable, TouchableOpacity, Animated } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { BACKEND_API } from "constants/api";
import Toast from "react-native-toast-message";
import Footer from "components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function search() {
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [locality, setLocality] = useState("");
  const [bank, setBank] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetTypeName, setAssetTypeName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [allBanks, setAllBanks] = useState([]);
  const [allAssetTypes, setAllAssetTypes] = useState([]);
  const router = useRouter();
  const [lastSearch, setLastSearch] = useState([] as any);
  const insets = useSafeAreaInsets();
  const headerHeight = 64 + insets.top;
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -headerHeight],
    extrapolate: "clamp",
  });

  useEffect(() => {
    fetchCities();
    fetchBanks();
    fetchAssetsType();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${BACKEND_API}user/cities`);
      if (response.ok) {
        const data = await response.json();
        setAllCities(
          data.cities.map((city) => ({ label: city?.name, value: city?.id }))
        );
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${BACKEND_API}auction/banks`);
      if (response.ok) {
        const data = await response.json();
        setAllBanks(
          data.banks.map((bank) => ({ label: bank?.name, value: bank?.id }))
        );
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const fetchAssetsType = async () => {
    try {
      const response = await fetch(`${BACKEND_API}auction/asset-types`);
      if (response.ok) {
        const data = await response.json();
        setAllAssetTypes(
          data.assetTypes.map((asset) => ({
            label: asset?.name,
            value: asset?.id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching asset types:", error);
    }
  };


  const handleSearch = async () => {
    if (city || assetType || bank || minPrice || maxPrice || locality) {
      if ((city && assetType) || (assetType && assetTypeName)) {
        const newSearch = { assetTypeName, assetType, cityName, city };

        try {
          const storedSearches = await AsyncStorage.getItem("lastSearches");
          let lastSearches = storedSearches ? JSON.parse(storedSearches) : [];

          // Check only the latest search (lastSearches[0])
          const isDuplicate = lastSearches.length > 0 &&
            lastSearches[0].assetType === newSearch.assetType &&
            lastSearches[0].city === newSearch.city;

          // If the latest search is different, send it to the backend
          if (!isDuplicate) {
            await sendLastSearchToBackend(city, assetType);
          }

          // Remove duplicate entries before adding the new one
          lastSearches = lastSearches.filter(
            (search) => search.assetType !== assetType || search.city !== city
          );

          // Add the new search at the beginning and limit to the last 3 searches
          lastSearches = [newSearch, ...lastSearches.slice(0, 2)];

          setLastSearch(lastSearches);
          await AsyncStorage.setItem("lastSearches", JSON.stringify(lastSearches));
        } catch (error) {
          console.error("Error saving last search:", error);
        }
      }

      router.push({
        pathname: `/auctions`,
        params: {
          bankId: bank,
          cityId: city,
          cityName: cityName,
          localityName: locality,
          assetTypeId: assetType,
          assetTypeName: assetTypeName,
          minPrice,
          maxPrice,
        },
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Please select at least one field",
      });
    }
  };

  // Function to send the last searched city and asset type ID to the backend
  async function sendLastSearchToBackend(cityId, assetTypeId) {
    console.log("Last search Api Call")

    const token = await AsyncStorage.getItem("token");

    try {
      await fetch(`${BACKEND_API}user/search-filters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          searchFilterCityId: cityId,
          searchFilterAssetTypeId: assetTypeId,
        }),
      });
      console.log("Last search sent to backend!");
    } catch (error) {
      console.error("Error sending last search:", error);
    }
  }


  const clearFilters = () => {
    setCity("");
    setLocality("")
    setBank("");
    setAssetType("");
    setAssetTypeName("");
    setCityName("");
    setMinPrice("");
    setMaxPrice("");
  };

  useEffect(() => {
    const fetchLastSearches = async () => {
      const storedSearches = await AsyncStorage.getItem("lastSearches");
      if (storedSearches) {
        setLastSearch(JSON.parse(storedSearches));
      }
    };
    fetchLastSearches();
  }, []);

  return (
    <LinearGradient
      colors={[APP_COLOR.primary, "#182848"]}
      style={styles.gradientBackground}
    >
      <Animated.View
        style={[
          styles.customHeader,
          {
            height: headerHeight,
            paddingTop: insets.top,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Text style={styles.customHeaderTitle}>Advanced Search</Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingTop: headerHeight }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <YStack flex={1} items="center" gap="$2">
          <View px="$4" style={styles.overlay}>
            <View style={styles.topContainer}>
              <View style={styles.badgeContainer}>
                <Ionicons name="search" size={12} color="#FFD700" />
                <Text style={styles.badgeText}>ADVANCED FILTERS</Text>
              </View>
              <Text style={styles.headerText}>
                Find the Perfect{"\n"}
                <Text style={styles.headerTextAccent}>Auction Properties</Text>
              </Text>
              <View style={styles.headerDivider} />
              <Text style={styles.subtext}>
                Refine listings by bank, city, locality, and price range to match your investment goals.
              </Text>

              <View style={styles.container}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  containerStyle={styles.dropdownContainer}
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  activeColor="rgba(0, 123, 255, 0.08)"
                  inputSearchStyle={styles.dropdownInputSearch}
                  data={allAssetTypes}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Asset Type"
                  value={assetType}
                  onChange={(item) => {
                    setAssetType(item?.value);
                    setAssetTypeName(item?.label);
                  }}
                  renderLeftIcon={() => (
                    <Ionicons
                      name="business-outline"
                      size={20}
                      color={APP_COLOR.primary}
                      style={{ marginRight: 8 }}
                    />
                  )}
                />

                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  containerStyle={styles.dropdownContainer}
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  activeColor="rgba(0, 123, 255, 0.08)"
                  inputSearchStyle={styles.dropdownInputSearch}
                  data={allBanks}
                  maxHeight={300}
                  search
                  searchPlaceholder="Search Bank..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select Bank"
                  value={bank}
                  onChange={(item) => setBank(item?.value)}
                  renderLeftIcon={() => (
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color={APP_COLOR.primary}
                      style={{ marginRight: 8 }}
                    />
                  )}
                />

                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  containerStyle={styles.dropdownContainer}
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  activeColor="rgba(0, 123, 255, 0.08)"
                  inputSearchStyle={styles.dropdownInputSearch}
                  data={allCities}
                  maxHeight={300}
                  search
                  searchPlaceholder="Search City..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select City"
                  value={city}
                  onChange={(item) => {
                    setCity(item?.value);
                    setCityName(item?.label);
                  }}
                  renderLeftIcon={() => (
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={APP_COLOR.primary}
                      style={{ marginRight: 8 }}
                    />
                  )}
                />

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="map-outline"
                    size={20}
                    color={APP_COLOR.primary}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Locality"
                    placeholderTextColor="#94a3b8"
                    keyboardType="default"
                    value={locality}
                    onChangeText={setLocality}
                  />
                </View>

                <View style={styles.priceContainer}>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Ionicons
                      name="pricetag-outline"
                      size={18}
                      color={APP_COLOR.primary}
                      style={{ marginRight: 6 }}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Min Price"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numeric"
                      value={minPrice}
                      onChangeText={setMinPrice}
                    />
                  </View>

                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Ionicons
                      name="pricetag-outline"
                      size={18}
                      color={APP_COLOR.primary}
                      style={{ marginRight: 6 }}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Max Price"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numeric"
                      value={maxPrice}
                      onChangeText={setMaxPrice}
                    />
                  </View>
                </View>

                <Toast />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={clearFilters}
                    style={[styles.actionButtonContainer, styles.clearButtonContainer]}
                  >
                    <View style={styles.clearButton}>
                      <Ionicons name="refresh-outline" size={18} color="#64748b" />
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSearch}
                    style={[styles.actionButtonContainer, styles.searchButtonContainer]}
                  >
                    <LinearGradient
                      colors={[APP_COLOR.primary, "#0056b3"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.searchButton}
                    >
                      <Text style={styles.searchButtonText}>Search</Text>
                      <Ionicons name="search-outline" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {lastSearch.length > 0 && (
                  <View style={styles.lastSearchSection}>
                    <View style={styles.lastSearchHeader}>
                      <Ionicons name="time-outline" size={14} color="#64748b" />
                      <Text style={styles.lastSearchTitle}>Recent Searches</Text>
                    </View>
                    <View style={{ maxWidth: "100%", overflow: "hidden" }}>
                      <View style={{ flexDirection: "row" }}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ flexDirection: "row", gap: 6 }}
                        >
                          {lastSearch.map((search, index) => (
                            <Pressable
                              key={index}
                              style={styles.lastSearchPill}
                              onPress={() =>
                                router.push({
                                  pathname: `/auctions`,
                                  params: {
                                    cityId: search?.city,
                                    assetTypeName: search?.assetTypeName,
                                    cityName: search.cityName,
                                    localityName: "",
                                    assetTypeId: search?.assetType,
                                    bankId: "",
                                    minPrice: "",
                                    maxPrice: "",
                                  },
                                })}
                            >
                              <Ionicons name="search-outline" size={12} color="#64748b" />
                              <Text style={styles.lastSearchText}>
                                #{search?.assetTypeName} {search?.assetTypeName && search.cityName && "in"} {search?.cityName}
                              </Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </YStack>
        <Footer />
      </Animated.ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 40,
    width: "100%",
  },
  topContainer: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 16,
    gap: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#ffffff",
    lineHeight: 28,
  },
  headerTextAccent: {
    color: "#FFD700",
    fontWeight: "900",
    textShadowColor: "rgba(255, 215, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  headerDivider: {
    width: 40,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    textAlign: "center",
    color: "#f1f5f9",
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 18,
    width: "100%",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  dropdown: {
    height: 46,
    borderColor: "rgba(0, 123, 255, 0.12)",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownPlaceholder: {
    color: "#94a3b8",
    fontSize: 13,
  },
  dropdownSelectedText: {
    color: "#1e293b",
    fontSize: 13,
    fontWeight: "500",
  },
  dropdownIcon: {
    width: 18,
    height: 18,
    tintColor: "#64748b",
  },
  dropdownContainer: {
    borderRadius: 14,
    marginTop: 4,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderColor: "#f1f5f9",
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  dropdownItemText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "500",
  },
  dropdownItemContainer: {
    borderRadius: 8,
    marginHorizontal: 6,
    marginVertical: 1,
    paddingVertical: 2,
  },
  dropdownInputSearch: {
    height: 36,
    borderRadius: 8,
    borderColor: "#cbd5e1",
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderColor: "rgba(0, 123, 255, 0.12)",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    width: "100%",
  },
  textInput: {
    flex: 1,
    height: "100%",
    color: "#1e293b",
    fontSize: 13,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
    marginTop: 4,
  },
  actionButtonContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  searchButtonContainer: {
    shadowColor: APP_COLOR.primary,
  },
  clearButtonContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchButton: {
    height: 46,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  clearButton: {
    height: 46,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
  },
  clearButtonText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "700",
  },
  lastSearchSection: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  lastSearchHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  lastSearchTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  lastSearchPill: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  lastSearchText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  customHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#182848",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  customHeaderTitle: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});