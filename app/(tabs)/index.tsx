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
import { Link, useRouter } from "expo-router";
import { BACKEND_API } from "constants/api";
import PopularCities from "components/PopularCities";
import Footer from "components/Footer";
import { useUser } from "../../context/UserContextProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabOneScreen() {
  const [allCities, setAllCities] = useState([] as any);
  const [topCities, setTopCities] = useState([] as any);
  const [allAssetTypes, setAllAssetTypes] = useState([] as any);
  const { user, setUser } = useUser();
  const [lastSearch, setLastSearch] = useState([] as any);
  const lastSearches = ["Flast in Nagpur", "House in Mumbai"];
  const router = useRouter();

  const [assetType, setAssetType] = useState("");
  const [assetTypeName, setAssetTypeName] = useState("");
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const handleSearch = async () => {
    if (!city && !assetType) {
      Toast.show({
        type: "error",
        text1: "Select City or Asset Type",
      });
      return;
    }

    const newSearch = { assetTypeName, cityName };

    try {
      const storedSearches = await AsyncStorage.getItem("lastSearches");
      let lastSearches = storedSearches ? JSON.parse(storedSearches) : [];

      lastSearches = [newSearch, ...lastSearches.slice(0, 1)];

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
        assetTypeId: assetType,
        assetTypeName: assetTypeName,
        bankId: "",
        minPrice: "",
        maxPrice: "",
      },
    });
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

  const fetchPopularCities = async () => {
    try {
      const response = await fetch(`${BACKEND_API}auction/top-cities`);
      if (response.ok) {
        const data = await response.json();
        setTopCities(data);
      } else {
        console.log("error white fetching cities ", response);
      }
    } catch (error) {
      console.error("Error fetching  cities :", error);
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

  useEffect(() => {
    getUser();
    fetchCities();
    fetchAssetsType();
    fetchPopularCities();
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

  return (
    <LinearGradient
      colors={["#4b6cb7", "#182848"]}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <YStack flex={1} items="center" gap="$2">
          <View px="$4" style={styles.overlay}>
            <View style={styles.topContainer}>
              <H3 style={styles.headerText}>
                Your Trusted Place{" "}
                <Text style={{ color: APP_COLOR.primary }}>
                  for Auctioned Assets
                </Text>
              </H3>

              <SizableText size="$5" text="center" color="white">
                Find your next great investment with our exclusive bank auction
                listings.
              </SizableText>

              <View style={styles.container}>
                <Dropdown
                  style={styles.dropdown}
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
                />

                <Dropdown
                  style={styles.dropdown}
                  data={allAssetTypes}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Asset Type"
                  value={assetType}
                  onChange={(item) => {
                    setAssetType(item?.value);
                    setAssetTypeName(item?.label);
                  }}
                />

                <Button
                  onPress={handleSearch}
                  fontSize={16}
                  fontWeight={700}
                  style={styles.button}
                >
                  Search Auction
                </Button>
                {lastSearch.length > 0 && (
                  <View style={{ padding: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 8,
                      }}
                    >
                      Last Searches
                    </Text>
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                    >
                      {lastSearch.map((search, index) => (
                        <Pressable
                          key={index}
                          style={{
                            backgroundColor: "#f0f0f0",
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            borderWidth: 1,
                            borderColor: "#d1d1d1",
                          }}
                        >
                          <Text style={{ fontSize: 14, color: "#333" }}>
                            #{search?.assetTypeName} in {search?.cityName}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
                {/* <Toast /> */}
              </View>
            </View>

            <PopularCities />

            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>
                Top Auctions{" "}
                <Text style={{ color: APP_COLOR.primary, fontWeight: "bold" }}>
                  Cities
                </Text>
              </Text>
              <FlatList
                data={topCities}
                scrollEnabled={false}
                keyExtractor={(item) => item?.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.cityRow}
                    onPress={() =>
                      router.push({
                        pathname: `/auctions`,
                        params: {
                          cityId: item?.id,
                          assetTypeName: "",
                          cityName: item?.name,
                          assetTypeId: "",
                          bankId: "",
                          minPrice: "",
                          maxPrice: "",
                        },
                      })
                    }
                  >
                    <Text style={styles.cityName}>
                      <AntDesign name="doubleright" size={24} color="#FFD700" />{" "}
                      {item.name} -{" "}
                      <Text style={styles.auctionCount}>{item?.count}</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
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
    paddingTop: 90,
  },
  topContainer: {},
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    // width: 310,
    borderRadius: 10,
    marginTop: 30,
    gap: 15,
    opacity: 0.9,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: APP_COLOR.primary,
    color: "white",
  },
  popularSection: {
    width: 260,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "white",
    borderBottomColor: "gold",
    borderBottomWidth: 2,
    marginHorizontal: 20,
  },
  cityRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: "rgba(255, 215, 0, 0.4)",
  },

  cityName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  auctionCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
  },

  carouselContainer: {
    alignItems: "center",
    height: 200,
  },

  scrollContent: {
    flexDirection: "row",
    paddingHorizontal: 6,
  },
  cityCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  cityImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
});
