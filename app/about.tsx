import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Footer from "components/Footer";
import { APP_COLOR } from "constants/Colors";

const { width } = Dimensions.get("window");

const carouselItems = [
  {
    id: "01",
    title: "Browse Auctions",
    description:
      "Explore a wide range of auctions for land, real estate, vehicles, machinery, and more.",
    icon: "search",
  },
  {
    id: "02",
    title: "Get Details",
    description:
      "View comprehensive information on each property or asset, including bank contacts, auction dates, and prices.",
    icon: "info-circle",
  },
  {
    id: "03",
    title: "Participate",
    description: "Bid on auctions that interest you and grab great deals.",
    icon: "gavel",
  },
  {
    id: "04",
    title: "Secure Transactions",
    description: "Ensuring secure transactions between buyers and banks.",
    icon: "shield-alt",
  },
];

const About = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = index === carouselItems.length - 1 ? 0 : index + 1;
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <FontAwesome5 name={item.icon} size={40} color="#ffffff" />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>ABOUT US</Text>
        <Text style={styles.subheading}>
          Welcome to{" "}
          <Text style={{ fontWeight: "bold", color: "#007AFF" }}>
            EAuctionsHub
          </Text>{" "}
          - Your Trusted Online Auctions Platform
        </Text>

        <Text style={styles.bodyText}>
          EAuctionsHub, developed by Aperra Solutions, is your go-to online
          Auctions listing platform, offering a wide range of properties and
          assets including land, houses, villas, residential and commercial
          properties, vehicles, industrial machinery, and more.
        </Text>

        <Text style={styles.heading}>How It Works</Text>

        <View style={styles.carouselWrapper}>
          <Animated.FlatList
            ref={flatListRef}
            data={carouselItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
        </View>

        <View style={styles.indicatorContainer}>
          {carouselItems.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
          })}
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 20 },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C7285",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "center",
  },

  pointContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  pointTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: APP_COLOR.primary,
  },
  pointText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 30,
    marginTop: 5,
    marginBottom: 10,
  },

  carouselWrapper: { alignItems: "center", marginBottom: 10 },
  cardContainer: { width: width * 0.8, padding: 10 },
  card: {
    height: 200,
    backgroundColor: "#5C7285",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  cardText: {
    fontSize: 14,
    color: "#f8f9fa",
    textAlign: "center",
    marginTop: 8,
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: APP_COLOR.primary,
    marginHorizontal: 5,
  },
});

export default About;
