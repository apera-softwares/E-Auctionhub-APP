import { APP_COLOR } from "constants/Colors";
import { Button, H3, Label, SizableText, Text, View, YStack } from "tamagui";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, ScrollView, TextInput, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { BACKEND_API } from "constants/api";
import Toast from "react-native-toast-message";
import Footer from "components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    <ScrollView
      contentContainerStyle={{flexGrow:1, backgroundColor: "#fff" }}
    >
      <View style={styles.container}>
        <YStack flex={1} items="center" gap="$3">

          <SizableText size="$5" text="center" color="black">
            Find auction listings with more filter options.
          </SizableText>

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

          <Dropdown
            style={styles.dropdown}
            data={allBanks}
            labelField="label"
            valueField="value"
            placeholder="Select Bank"
            value={bank}
            onChange={(item) => setBank(item?.value)}
          />
          <Toast />
          <Dropdown
            style={styles.dropdown}
            data={allCities}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            search
            searchPlaceholder="Search City..."
            value={city}
            onChange={(item) => {
              setCity(item?.value);
              setCityName(item?.label);
            }}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Locality"
            keyboardType="default"
            value={locality}
            onChangeText={setLocality}
          />


          <View style={styles.priceContainer}>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Min Price"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Max Price"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={clearFilters}
              style={styles.clearButton}
              fontSize={16}
              fontWeight={700}
            >
              Clear
            </Button>
            <Button
              onPress={handleSearch}
              fontSize={16}
              fontWeight={700}
              style={styles.searchButton}
            >
              Search
            </Button>
          </View>
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
              <View style={{ maxWidth: "100%", overflow: "hidden" }}>
                <View style={{ flexDirection: "row" }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: "row", gap: 4 }}
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
                        <Text style={{ fontSize: 14, color: "#333" }}>
                          #{search?.assetTypeName} {search?.assetTypeName && search.cityName && "in"} {search?.cityName}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>

            </View>
          )}
        </YStack>
      </View>
      <View>
        <Footer />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
    paddingTop: 40,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
  },
  button: {
    backgroundColor: APP_COLOR.primary,
    color: "white",
    paddingVertical: 12,
    borderRadius: 8,
    textAlign: "center",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },

  searchButton: {
    flex: 1,
    backgroundColor: APP_COLOR.primary,
    color: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  clearButton: {
    flex: 1,
    // backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "gray",
    color: "gray",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  priceContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  priceInput: {
    flex: 1,
  },
});