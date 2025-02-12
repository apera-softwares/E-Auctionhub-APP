import { APP_COLOR } from "constants/Colors";
import {
  Button,
  H3,
  Image,
  SizableText,
  Text,
  View,
  YStack,
  XStack,
} from "tamagui";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { BACKEND_API } from "constants/api";

export default function TabOneScreen() {
  const popularCities = [
    {
      label: "Pune",
      image:
        "https://mittalbuilders.com/wp-content/uploads/2020/12/Reasons-to-settle-down-in-Pune-1400x700.png",
    },
    {
      label: "Delhi",
      image:
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0f/c5/e8/5c.jpg",
    },
    {
      label: "Begaluru",
      image: "https://i.ytimg.com/vi/BocpjJwBdBs/sddefault.jpg",
    },
    {
      label: "Nagpur",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRPddJFx9OwOU29hUYyd3eDoIgARnBKwrS4A&s",
    },
  ];

  const [city, setCity] = useState("");
  const [allCities, setAllCities] = useState([] as any);
  const [allAssetTypes, setAllAssetTypes] = useState([] as any);

  const [assetType, setAssetType] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${BACKEND_API}user/cities`);
      if (response.ok) {
        const data = await response.json();
        let allCities: any[] = [
          {
            label: "Select City",
            value: "",
          },
        ];
        data?.cities.forEach((city: any) => {
          allCities.push({
            label: city?.name,
            value: city?.id,
          });
        });

        setAllCities(allCities);
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

      // console.log("assets response : ", response);

      if (response.ok) {
        const data = await response.json();
        console.log("assets data : ", data);
        let allAssets: any[] = [
          {
            label: "Select Asset Type",
            value: "",
          },
        ];
        data?.assetTypes.forEach((asset: any) => {
          allAssets.push({
            label: asset?.name,
            value: asset?.id,
          });
        });
        setAllAssetTypes(allAssets);
      } else {
        console.log("error while fetching assets type", response);
      }
    } catch (error) {
      console.error("Error fetching assets type", error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchAssetsType();
  }, []);

  return (
    <YStack flex={1} items="center" gap="$2" bg="$background">
      <View position="relative" width="100%">
        <Image
          source={{
            uri: "https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg?auto=compress&cs=tinysrgb&w=600",
            height: 300,
          }}
          width={"100%"}
          height={"100%"}
        />
        <View px="$4" bg="rgba(0,0,0,0.5)" style={styles.overlay}>
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
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => setCity(item.value)}
            />
            <Dropdown
              style={styles.dropdown}
              data={allAssetTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Asset Type"
              value={assetType}
              onChange={(item) => setAssetType(item.value)}
            />
            <Link
              href={{
                pathname: "/auctions",
                params: { cityId: city, assetTypeId: assetType },
              }}
              style={styles.button}
            >
              Search Auction
            </Link>
          </View>
          {/* <View style={styles.popularSection}>
            <H3 style={styles.sectionTitle}>POPULAR CITIES</H3>
            <FlatList
              data={popularCities}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cityImage}
                  />
                  <Text style={styles.cityLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View> */}
        </View>
      </View>

      {/* Popular Cities Section */}
    </YStack>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    marginTop: 30,
    gap: 15,
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
    paddingVertical: 12,
    borderRadius: 8,
    textAlign: "center",
  },
  popularSection: {
    width: "100%",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "white",
  },
  cityCard: {
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  cityImage: {
    width: 100,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cityLabel: {
    textAlign: "center",
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});
