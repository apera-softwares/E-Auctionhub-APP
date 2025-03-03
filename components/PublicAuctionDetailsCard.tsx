import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { formateDate, onShare } from "constants/staticData";
import { APP_COLOR } from "constants/Colors";
import { BACKEND_API } from "constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useUser } from "context/UserContextProvider";
import { useRouter } from "expo-router";

interface PublicAuctionDetailsCardProps {
  assetType: string;
  areaSqFt?: string;
  reservePrice?: string;
  emd: string;
  bank: string;
  locality: string;
  city: string;
  state: string;
  startDate: string;
  applicationDeadLine: string;
  auctionId: string;
  isFav: boolean;
}

const PublicAuctionDetailsCard: React.FC<PublicAuctionDetailsCardProps> = ({
  assetType,
  areaSqFt,
  reservePrice,
  emd,
  bank,
  locality,
  city,
  state,
  startDate,
  applicationDeadLine,
  auctionId,
  isFav,
}) => {
  const [fav, setFav] = useState<boolean>(isFav);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setFav(isFav);
  }, [isFav]);

  const addTofav = async () => {
    if(!user.isLogin){
      return router.push("/login")
    }
    const token = await AsyncStorage.getItem("token");
    console.log(token, "token");
    try {
      const response = await fetch(`${BACKEND_API}auction/favourite/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auctionId: auctionId,
        }),
      });

      const data = await response.json();
      setFav(data.statusCode == 200 ? false : true);
    } catch (error) {
      console.log(error, "add to fav error");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={addTofav}>
          {fav ? (
            <FontAwesome name="heart" size={22} color="red" />
          ) : (
            <FontAwesome5 name="heart" size={22} color={APP_COLOR.primary} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={()=>onShare(auctionId)}>
          <FontAwesome5 name="share-alt" size={22} color={APP_COLOR.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.topInfo}>
        <Text style={styles.assetType}>
          {assetType}{" "}
          <Text style={{ fontWeight: "500", fontSize: 14, color: "#444" }}>
            {city}
          </Text>
        </Text>
        <View style={styles.priceContainer}>
          <FontAwesome5 name="rupee-sign" size={16} color="white" />
          <Text style={styles.reservePrice}>{reservePrice}</Text>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <DetailField
          icon="ruler-combined"
          title="Area: "
          text={`${areaSqFt || ""} sqft`}
        />
        <DetailField icon="coins" title="EMD: " text={`₹ ${emd}`} />
        <DetailField icon="university" title="Bank: " text={`${bank}`} />
        <DetailField
          icon="map-marker-alt"
          title="Location: "
          text={`${locality || ""}${locality ? "," : ""} ${city}, ${state}`}
        />
        <DetailField
          icon="calendar-alt"
          title="Start Date: "
          text={`${formateDate(startDate)}`}
        />
        <DetailField
          icon="clock"
          title="Deadline: "
          text={`${
            applicationDeadLine ? formateDate(applicationDeadLine) : "NA"
          }`}
        />
      </View>
    </View>
  );
};

const DetailField = ({ icon, text, title, color = "#333" }) => (
  <View style={styles.detailRow}>
    <FontAwesome5 name={icon} size={18} color={"#41644A"} />
    <Text style={[styles.field, { color }]}>
      {title}
      <Text style={{ fontWeight: "semibold" }}>{text}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 50,
  },

  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  assetType: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    lineHeight: 30,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  reservePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5,
  },

  fieldContainer: {
    marginTop: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  field: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
    opacity: 0.8,
  },
});

export default PublicAuctionDetailsCard;
