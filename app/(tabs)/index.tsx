import { APP_COLOR } from "constants/Colors";
import { Button, H3, SizableText, Text, View, YStack } from "tamagui";
import { Dropdown } from "react-native-element-dropdown";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BACKEND_API } from "constants/api";
import PopularCities from "components/PopularCities";
import Footer from "components/Footer";
import { useUser } from "../../context/UserContextProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabOneScreen() {
  const [allCities, setAllCities] = useState([] as any);
  const [allAssetTypes, setAllAssetTypes] = useState([] as any);
  const { user, setUser } = useUser();
  const [lastSearch, setLastSearch] = useState([] as any);
  const { auctionId } = useLocalSearchParams() as any;
  const router = useRouter();

  const [assetType, setAssetType] = useState("");
  const [assetTypeName, setAssetTypeName] = useState("");
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");

  const handleSearch = async () => {
    if (!city && !assetType) {
      Toast.show({
        type: "error",
        text1: "Select City or Asset Type",
      });
      return;
    }

    const newSearch = { assetTypeName, assetType, cityName, city };

    try {
      const storedSearches = await AsyncStorage.getItem("lastSearches");
      let lastSearches = storedSearches ? JSON.parse(storedSearches) : [];

      const isDuplicate =
        lastSearches.length > 0 &&
        lastSearches[0].assetType === newSearch.assetType &&
        lastSearches[0].city === newSearch.city;

      console.log(lastSearches, "lastSearches[0]");

      if (!isDuplicate) {
        await sendLastSearchToBackend(city, assetType);
      }

      lastSearches = lastSearches.filter(
        (search) => search.assetType !== assetType || search.city !== city
      );

      lastSearches = [newSearch, ...lastSearches.slice(0, 2)];

      setLastSearch(lastSearches);
      await AsyncStorage.setItem("lastSearches", JSON.stringify(lastSearches));
    } catch (error) {
      console.error("Error saving last search:", error);
    }

    router.push({
      pathname: "/auctions",
      params: {
        cityId: city,
        cityName: cityName,
        localityName: "",
        assetTypeId: assetType,
        assetTypeName: assetTypeName,
        bankId: "",
        minPrice: "",
        maxPrice: "",
      },
    });
  };

  async function sendLastSearchToBackend(cityId, assetTypeId) {

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

  useEffect(() => {
    const fetchLastSearches = async () => {
      const storedSearches = await AsyncStorage.getItem("lastSearches");
      if (storedSearches) {
        setLastSearch(JSON.parse(storedSearches));
      }
    };
    fetchLastSearches();
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

  // const fetchPopularCities = async () => {
  //   console.log("called")
  //   try {
  //     const response = await fetch(`${BACKEND_API}auction/top-cities`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setTopCities(data);
  //     } else {
  //       console.log("error white fetching cities ", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching  cities :", error);
  //   }
  // };

  const fetchAssetsType = async () => {
    try {
      const response = await fetch(`${BACKEND_API}auction/asset-types`);
      if (response.ok) {
        const data = await response.json();
        setAllAssetTypes([
          { label: "All Types", value: "" },
          ...data.assetTypes.map((asset) => ({
            label: asset?.name,
            value: asset?.id,
          })),
        ]);
      }
    } catch (error) {
      console.error("Error fetching asset types:", error);
    }
  };

  useEffect(() => {
    getUser();
    fetchCities();
    fetchAssetsType();
    // fetchPopularCities();
    if (auctionId) {
      router.push({
        pathname: `/auctionDetails`,
        params: { auctionId: auctionId },
      })
    }
  }, []);

  const getUser = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) return;
    try {
      const URL = `${BACKEND_API}user/get-user`;
      const response = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        setUser((prev: any) => ({
          ...prev,
          id: data?.data?.id,
          name: data?.data?.name,
          phone: data?.data?.phone,
          role: data?.data?.role,
          isSubscribed: data?.data?.subscribed,
          isLogin: data?.data?.verified,
          subscribedPlan: data?.data?.subscribedPlan[0] || null,
        }));
      } else {
      }
    } catch (error) {
      console.log("error while getting user", error);
    }
  };
  // colors={[APP_COLOR.primary, "#182848"]}


  return (
    <LinearGradient
      colors={[APP_COLOR.primary, "#182848"]}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <YStack flex={1} items="center" gap="$2">
          <View px="$4" style={styles.overlay}>
            <View style={styles.topContainer}>
              <View style={styles.badgeContainer}>
                <Ionicons name="shield-checkmark" size={12} color="#4ade80" />
                <Text style={styles.badgeText}>SECURE & VERIFIED BANK AUCTIONS</Text>
              </View>
              <Text style={styles.headerText}>
                Your Trusted Portal{"\n"}
                <Text style={styles.headerTextAccent}>for Auctioned Assets</Text>
              </Text>
              <View style={styles.headerDivider} />
              <Text style={styles.subtext}>
                Find your next great investment with our exclusive bank auction listings.
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
                  data={allCities}
                  maxHeight={300}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder="Select City"
                  searchPlaceholder="Search City..."
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
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSearch}
                  style={styles.searchButtonContainer}
                >
                  <LinearGradient
                    colors={[APP_COLOR.primary, "#0056b3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.searchButton}
                  >
                    <Text style={styles.searchButtonText}>Search Auctions</Text>
                    <Ionicons name="search" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

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
            <PopularCities />
          </View>
        </YStack>
        <Footer />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
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
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#ffffff",
    lineHeight: 34,
  },
  headerTextAccent: {
    color: "#FFD700",
    fontWeight: "900",
    textShadowColor: "rgba(255, 215, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  headerDivider: {
    width: 48,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#f1f5f9",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 24,
    marginTop: 25,
    width: "100%",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  dropdown: {
    height: 54,
    borderColor: "rgba(0, 123, 255, 0.12)",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownPlaceholder: {
    color: "#94a3b8",
    fontSize: 14,
  },
  dropdownSelectedText: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: "#64748b",
  },
  dropdownContainer: {
    borderRadius: 16,
    marginTop: 4,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderColor: "#f1f5f9",
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  dropdownItemText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownItemContainer: {
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 2,
    paddingVertical: 4,
  },
  dropdownInputSearch: {
    height: 40,
    borderRadius: 10,
    borderColor: "#cbd5e1",
    fontSize: 14,
  },
  searchButtonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
    elevation: 3,
    shadowColor: APP_COLOR.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  searchButton: {
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
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
});
