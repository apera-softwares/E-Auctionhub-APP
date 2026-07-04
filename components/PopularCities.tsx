import { APP_COLOR } from "constants/Colors";
import { popularCitiesList } from "constants/staticData";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const PopularCities = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>EXPLORE DESTINATIONS</Text>
          <Text style={styles.title}>
            Popular <Text style={styles.titleAccent}>Cities</Text>
          </Text>
        </View>
        <Ionicons name="map-outline" size={22} color="rgba(255, 255, 255, 0.6)" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {popularCitiesList.map((city: any, index: number) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.85}
            style={styles.cityCard}
            onPress={() =>
              router.push({
                pathname: `/auctions`,
                params: {
                  cityId: city?.id,
                  cityName: city?.name,
                  localityName: "",
                  assetTypeId: "",
                  assetTypeName: "",
                  bankId: "",
                  minPrice: "",
                  maxPrice: "",
                },
              })
            }
          >
            <Image source={city?.image} style={styles.cityImage} />
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.85)"]}
              style={styles.gradientOverlay}
            >
              <View style={styles.cardInfo}>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-sharp" size={12} color="#FFD700" />
                  <Text style={styles.cityName}>{city?.name}</Text>
                </View>
                <View style={styles.exploreBadge}>
                  <Text style={styles.exploreText}>View Auctions</Text>
                  <Ionicons name="arrow-forward" size={10} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleContainer: {
    alignItems: "flex-start",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFD700",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    
  },
  titleAccent: {
    color: "#FFD700",
    fontWeight: "800",
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    flexDirection: "row",
    gap: 12,
  },
  cityCard: {
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1e293b",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cityImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  gradientOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  cardInfo: {
    padding: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  cityName: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  exploreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exploreText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 9,
    fontWeight: "500",
  },
});

export default PopularCities;

