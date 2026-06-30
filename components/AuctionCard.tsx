import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { APP_COLOR } from "constants/Colors";
import { formateDate, onShare } from "constants/staticData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API } from "constants/api";
import { useEffect, useState } from "react";
import { useUser } from "context/UserContextProvider";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const FALLBACK_IMAGE = (assetType: string) => {
  if (assetType === "Flat") return require("assets/images/assetsTypes/apartment.png");
  if (assetType === "House") return require("assets/images/assetsTypes/home.png");
  if (assetType === "Bungalow") return require("assets/images/assetsTypes/bungalow.png");
  if (assetType === "Shop") return require("assets/images/assetsTypes/shop.png");
  if (assetType === "Office") return require("assets/images/assetsTypes/office.png");
  return require("assets/images/assetsTypes/land.png");
};

export const AuctionCard = ({ data: auction, numColumns = 2 }) => {
  const router = useRouter();
  const [fav, setFav] = useState<boolean>(auction.favourite);
  const { user } = useUser();

  useEffect(() => { setFav(auction.favourite); }, [auction.favourite]);

  const addTofav = async () => {
    if (!user.isLogin) return router.push("/login");
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_API}auction/favourite/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ auctionId: auction.id }),
      });
      const data = await response.json();
      setFav(data.statusCode == 200 ? false : true);
    } catch (e) { console.log(e); }
  };

  const incrementAuctionViewCount = async () => {
    const token = await AsyncStorage.getItem("token");
    let headers: any = {};
    try {
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await fetch(`${BACKEND_API}auction/view/${auction.id}`, { method: "POST", headers });
    } catch (e) { console.log(e); }
  };

  const goToDetails = () => {
    incrementAuctionViewCount();
    router.push({ pathname: `/auctionDetails`, params: { auctionId: auction.id } });
  };

  let cardWidth = width - 24;
  if (numColumns === 2) cardWidth = (width - 32) / 2;
  else if (numColumns === 3) cardWidth = (width - 36) / 3;

  const hasImage = auction?.imageUrl?.length > 0;

  // ─── 1 Column ──────────────────────────────────────────────────────────
  if (numColumns === 1) {
    return (
      <TouchableOpacity style={[s.card1, { width: cardWidth }]} onPress={goToDetails} activeOpacity={0.93}>
        {/* Image */}
        <View style={s.img1Container}>
          <Image
            source={hasImage ? { uri: auction.imageUrl[0] } : FALLBACK_IMAGE(auction.assetType)}
            style={s.imgFull}
            resizeMode={hasImage ? "cover" : "contain"}
          />
          {/* Gradient overlay bottom */}
          <LinearGradient
            colors={["transparent", "rgba(10,18,40,0.55)"]}
            style={s.imgGradient}
          />
          {/* Type badge on image */}
          <View style={s.typeBadge1}>
            <Text style={s.typeBadgeText}>{auction.assetType || "Property"}</Text>
          </View>
          {/* Fav + Share */}
          <TouchableOpacity style={s.fabLeft} onPress={addTofav}>
            <FontAwesome name={fav ? "heart" : "heart-o"} size={13} color={fav ? "#f43f5e" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity style={s.fabRight} onPress={() => onShare({ id: auction?.id, assetType: auction?.assetType, city: auction?.city })}>
            <FontAwesome name="share-alt" size={13} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={s.body1}>
          <View style={s.row}>
            <Text style={s.price1}>
              <FontAwesome name="rupee" size={14} color="#059669" />{" "}
              {auction?.reservePrice?.toLocaleString()}
            </Text>
            <View style={s.cityPill}>
              <FontAwesome6 name="location-dot" size={10} color="#007bff" />
              <Text style={s.cityPillText} numberOfLines={1}>{auction.city}</Text>
            </View>
          </View>

          <View style={s.row} >
            <View style={s.bankRow}>
              <Image
                source={{ uri: `https://media.aperasoftwares.com/uploads/auction/bank-${auction.bankId}.png` }}
                style={s.bankLogo1}
                resizeMode="contain"
              />
              <Text style={s.bankText1} numberOfLines={1}>{auction?.bank || "NA"}</Text>
            </View>
            <View style={s.dateRow}>
              <Fontisto name="date" size={10} color="#64748b" />
              <Text style={s.dateText}>{formateDate(auction.startDate) || "NA"}</Text>
            </View>
          </View>

          <TouchableOpacity style={s.btn1} onPress={goToDetails} activeOpacity={0.85}>
            <LinearGradient colors={["#007bff", "#0056d6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.btn1Gradient}>
              <Text style={s.btn1Text}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  // ─── 2 Column ──────────────────────────────────────────────────────────
  if (numColumns === 2) {
    return (
      <TouchableOpacity style={[s.card2, { width: cardWidth }]} onPress={goToDetails} activeOpacity={0.93}>
        {/* Image */}
        <View style={s.img2Container}>
          <Image
            source={hasImage ? { uri: auction.imageUrl[0] } : FALLBACK_IMAGE(auction.assetType)}
            style={s.imgFull}
            resizeMode={hasImage ? "cover" : "contain"}
          />
          <LinearGradient colors={["transparent", "rgba(10,18,40,0.6)"]} style={s.imgGradient} />

          {/* Asset type chip */}
          <View style={s.chip2}>
            <Text style={s.chip2Text} numberOfLines={1}>{auction.assetType || "Property"}</Text>
          </View>

          <TouchableOpacity style={s.fabLeft2} onPress={addTofav}>
            <FontAwesome name={fav ? "heart" : "heart-o"} size={11} color={fav ? "#f43f5e" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity style={s.fabRight2} onPress={() => onShare({ id: auction?.id, assetType: auction?.assetType, city: auction?.city })}>
            <FontAwesome name="share-alt" size={11} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={s.body2}>
          {/* Price */}
          <View style={s.priceBadge2}>
            <FontAwesome name="rupee" size={11} color="#059669" />
            <Text style={s.price2} numberOfLines={1}>{auction?.reservePrice?.toLocaleString()}</Text>
          </View>

          {/* City */}
          <View style={s.infoRow2}>
            <FontAwesome6 name="location-dot" size={10} color="#007bff" />
            <Text style={s.infoText2} numberOfLines={1}>{auction.city}</Text>
          </View>

          {/* Bank */}
          <View style={s.infoRow2}>
            <Image
              source={{ uri: `https://media.aperasoftwares.com/uploads/auction/bank-${auction.bankId}.png` }}
              style={s.bankLogo2}
              resizeMode="contain"
            />
            <Text style={s.infoText2} numberOfLines={1}>{auction?.bank || "NA"}</Text>
          </View>

          {/* Date */}
          <View style={s.infoRow2}>
            <Fontisto name="date" size={9} color="#64748b" />
            <Text style={s.dateText2} numberOfLines={1}>{formateDate(auction.startDate) || "NA"}</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={s.btn2Wrap} onPress={goToDetails} activeOpacity={0.85}>
          <LinearGradient colors={["#007bff", "#0056d6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.btn2}>
            <Text style={s.btn2Text}>View Details</Text>
            <Ionicons name="arrow-forward" size={12} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // ─── 3 Column ──────────────────────────────────────────────────────────
  return (
    <TouchableOpacity style={[s.card3, { width: cardWidth }]} onPress={goToDetails} activeOpacity={0.93}>
      <View style={s.img3Container}>
        <Image
          source={hasImage ? { uri: auction.imageUrl[0] } : FALLBACK_IMAGE(auction.assetType)}
          style={s.imgFull}
          resizeMode={hasImage ? "cover" : "contain"}
        />
        <LinearGradient colors={["transparent", "rgba(10,18,40,0.65)"]} style={s.imgGradient} />

        <TouchableOpacity style={s.fabLeft3} onPress={addTofav}>
          <FontAwesome name={fav ? "heart" : "heart-o"} size={8} color={fav ? "#f43f5e" : "#fff"} />
        </TouchableOpacity>
        <TouchableOpacity style={s.fabRight3} onPress={() => onShare({ id: auction?.id, assetType: auction?.assetType, city: auction?.city })}>
          <FontAwesome name="share-alt" size={8} color="#fff" />
        </TouchableOpacity>

        {/* Price overlay on image */}
        <View style={s.priceOverlay3}>
          <FontAwesome name="rupee" size={8} color="#fff" />
          <Text style={s.priceOverlay3Text} numberOfLines={1}>{auction?.reservePrice?.toLocaleString()}</Text>
        </View>
      </View>

      <View style={s.body3}>
        <Text style={s.type3} numberOfLines={1}>{auction.assetType || "Property"}</Text>
        <View style={s.infoRow3}>
          <FontAwesome6 name="location-dot" size={8} color="#007bff" />
          <Text style={s.info3} numberOfLines={1}>{auction.city}</Text>
        </View>
        <View style={s.infoRow3}>
          <Fontisto name="date" size={7} color="#94a3b8" />
          <Text style={s.date3} numberOfLines={1}>{formateDate(auction.startDate) || "NA"}</Text>
        </View>
      </View>

      <TouchableOpacity style={s.btn3Wrap} onPress={goToDetails} activeOpacity={0.85}>
        <LinearGradient colors={["#007bff", "#0056d6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.btn3}>
          <Text style={s.btn3Text}>View</Text>
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  imgFull: { width: "100%", height: "100%" },
  imgGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: "55%" },

  // ── Shared fab buttons ─────────────────────────
  fabLeft: {
    position: "absolute", top: 8, left: 8,
    backgroundColor: "rgba(15,23,42,0.55)",
    borderRadius: 50, width: 28, height: 28,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  fabRight: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: "rgba(15,23,42,0.55)",
    borderRadius: 50, width: 28, height: 28,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },

  // ── 1 Column ─────────────────────────────────────
  card1: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e8f0fe",
    overflow: "hidden",
  },
  img1Container: {
    width: "100%", height: 170,
    backgroundColor: "#e8f0fe",
    position: "relative",
  },
  typeBadge1: {
    position: "absolute", bottom: 10, left: 10,
    backgroundColor: "rgba(0,123,255,0.85)",
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
  body1: { padding: 14, gap: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price1: { fontSize: 17, fontWeight: "800", color: "#065f46" },
  cityPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#eff6ff", paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20, borderWidth: 1, borderColor: "#dbeafe",
  },
  cityPillText: { fontSize: 11, color: "#1d4ed8", fontWeight: "600" },
  bankRow: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  bankLogo1: { width: 18, height: 18, borderRadius: 3 },
  bankText1: { fontSize: 12, color: "#475569", fontWeight: "500", flex: 1 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 11, color: "#64748b", fontWeight: "500" },
  btn1: { marginTop: 2, borderRadius: 12, overflow: "hidden", elevation: 3, shadowColor: "#007bff", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  btn1Gradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12 },
  btn1Text: { color: "#fff", fontWeight: "700", fontSize: 14, letterSpacing: 0.3 },

  // ── 2 Column ─────────────────────────────────────
  card2: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginVertical: 5,
    marginHorizontal: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8f0fe",
    overflow: "hidden",
  },
  img2Container: { width: "100%", height: 110, backgroundColor: "#e8f0fe", position: "relative" },
  chip2: {
    position: "absolute", bottom: 8, left: 8,
    backgroundColor: "rgba(0,123,255,0.82)",
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  chip2Text: { color: "#fff", fontSize: 9, fontWeight: "700" },
  fabLeft2: {
    position: "absolute", top: 6, left: 6,
    backgroundColor: "rgba(15,23,42,0.55)",
    borderRadius: 50, width: 22, height: 22,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  fabRight2: {
    position: "absolute", top: 6, right: 6,
    backgroundColor: "rgba(15,23,42,0.55)",
    borderRadius: 50, width: 22, height: 22,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  body2: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 4, gap: 4 },
  priceBadge2: { flexDirection: "row", alignItems: "center", gap: 3 },
  price2: { fontSize: 14, fontWeight: "800", color: "#065f46" },
  infoRow2: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoText2: { fontSize: 11, color: "#475569", fontWeight: "500", flex: 1 },
  bankLogo2: { width: 13, height: 13, borderRadius: 2 },
  dateText2: { fontSize: 10, color: "#94a3b8", fontWeight: "500", flex: 1 },
  btn2Wrap: {
    margin: 10, marginTop: 8,
    borderRadius: 10, overflow: "hidden",
    elevation: 3, shadowColor: "#007bff",
    shadowOpacity: 0.28, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  btn2: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  btn2Text: { color: "#fff", fontWeight: "700", fontSize: 12, letterSpacing: 0.2 },

  // ── 3 Column ─────────────────────────────────────
  card3: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 3,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e8f0fe",
    overflow: "hidden",
  },
  img3Container: { width: "100%", height: 75, backgroundColor: "#e8f0fe", position: "relative" },
  fabLeft3: {
    position: "absolute", top: 4, left: 4,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: 50, width: 16, height: 16,
    alignItems: "center", justifyContent: "center",
  },
  fabRight3: {
    position: "absolute", top: 4, right: 4,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: 50, width: 16, height: 16,
    alignItems: "center", justifyContent: "center",
  },
  priceOverlay3: {
    position: "absolute", bottom: 5, left: 5,
    flexDirection: "row", alignItems: "center", gap: 2,
    backgroundColor: "rgba(6,95,70,0.85)",
    paddingHorizontal: 5, paddingVertical: 2,
    borderRadius: 10,
  },
  priceOverlay3Text: { color: "#fff", fontSize: 8, fontWeight: "800" },
  body3: { paddingHorizontal: 7, paddingTop: 6, paddingBottom: 4, gap: 3 },
  type3: { fontSize: 10, fontWeight: "700", color: "#1e293b" },
  infoRow3: { flexDirection: "row", alignItems: "center", gap: 3 },
  info3: { fontSize: 9, color: "#475569", flex: 1 },
  date3: { fontSize: 8, color: "#94a3b8", flex: 1 },
  btn3Wrap: {
    marginHorizontal: 7, marginBottom: 8, marginTop: 4,
    borderRadius: 8, overflow: "hidden",
    elevation: 2, shadowColor: "#007bff",
    shadowOpacity: 0.25, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  btn3: { alignItems: "center", justifyContent: "center", paddingVertical: 7 },
  btn3Text: { color: "#fff", fontWeight: "700", fontSize: 10, letterSpacing: 0.2 },
});
