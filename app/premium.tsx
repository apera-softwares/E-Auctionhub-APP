import AsyncStorage from "@react-native-async-storage/async-storage";
import PremiumSkeleton from "components/Loaders/PremiumSkeleton";
import { BACKEND_API } from "constants/api";
import { APP_COLOR } from "constants/Colors";
import { useUser } from "context/UserContextProvider";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

import Constants from "expo-constants";
import { useRouter } from "expo-router";

const PremiumScreen = () => {
  const [currentPlan, setCurrentPlan] = useState("");
  const [premiumPlans, setPremiumPlans] = useState([] as any);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const router = useRouter();

  console.log(user, "user");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    getPremiumPlan();
  }, []);

  const getPremiumPlan = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_API}subscribe/plans`);
      const data = await response.json();

      console.log(data, "data prmium");

      setPremiumPlans(data?.data);
    } catch (error) {
      console.log("error while fetching premium plan", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (amount: string) => {
    try {
      const token = await AsyncStorage.getItem("token");

      setIsProcessing(true);

      // Create an order
      const orderResponse = await fetch(
        `${BACKEND_API}subscribe/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: amount,
          }),
        }
      );

      const orderData = await orderResponse.json();
      console.log(orderData, "order Data");

      if (!orderData?.data?.id) {
        throw new Error("Order creation failed");
      }

      let options = {
        image:
          "http://209.182.232.11:4044/uploads/auction/media-1740385842172-395417771.png",
        description: " Subscribe and get access to premium features.",
        currency: "INR",
        key: Constants.expoConfig?.extra?.RAZORPAY_KEY,
        amount: Number(amount),
        external: {
          wallets: ["paytm"],
        },
        name: "EAuctionsHub",
        order_id: orderData.data.id,
        prefill: {
          name: user.name,
          contact: user.phone,
        },
        theme: { color: "#007bff" },
      };

      console.log(options, "options");

      RazorpayCheckout.open(options)
        .then(async (data) => {
          console.log(data, "checkout data ");
          try {
            const response = {
              razorpayPaymentId: data.razorpay_payment_id,
              razorpayOrderId: data.razorpay_order_id,
              razorpaySignature: data.razorpay_signature,
              amount: amount,
            };

            const paymentResponse = await fetch(
              `${BACKEND_API}subscribe/add-records`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(response),
              }
            );

            const paymentData = await paymentResponse.json();
            console.log("RESULT ", paymentData);

            if (paymentData.status === true) {
              setIsProcessing(false);
              router.push("/paymentSucess");

              return;
            } else {
              throw new Error("Payment failed");
            }
          } catch (error) {
            console.error("Payment processing error:", error);
            alert("Payment Failed");
          } finally {
            setIsProcessing(false);
          }
        })
        .catch((error) => {
          console.log("Razorpay Error:", error);
          // alert(`Error: ${error.description || error}`);
          setIsProcessing(false);
        });
    } catch (error) {
      console.error("Payment Error:", error);
      // alert("An error occurred while processing the payment.");
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {currentPlan ? "Current Plan" : "Choose a Plan"}
      </Text>
      <ScrollView
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <PremiumSkeleton key={index} />
            ))
          : premiumPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.card,
                  currentPlan === plan.id && styles.activeCard,
                ]}
                onPress={() => console.log(`Subscribed to ${plan.title}`)}
              >
                <Text style={styles.planTitle}>
                  {plan.durationInDays == "90"
                    ? "Quarterly Plan"
                    : plan.durationInDays == "180"
                    ? "Half Year Plan"
                    : plan.durationInDays == "365"
                    ? "Yearly Plan"
                    : "N/A"}
                </Text>
                <Text style={styles.price}>₹ {plan.amount}</Text>
                <Text style={styles.duration}>
                  / {plan.durationInDays} days
                </Text>
                <Text style={styles.description}>
                  Subscribe and get access to premium features.
                </Text>
                <Text style={styles.featureTitle}>Features</Text>
                <Text style={styles.features}>
                  ✔ Premium Membership{"\n"}✔ Access to auction documents{"\n"}✔
                  Access to auction notice{"\n"}✔ Daily email alert{"\n"}✔ View
                  all auction details{"\n"}✔ Get location on map
                </Text>
                <TouchableOpacity style={styles.buyNowButton}>
                  <Text
                    style={styles.buyNowText}
                    onPress={() =>
                      user.isLogin
                        ? handlePayment(plan.amount)
                        : router.push("/login")
                    }
                  >
                    Buy Now
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardsContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: "#ff9800",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 27,
    fontWeight: "bold",
    color: "green",
  },
  duration: {
    fontSize: 16,
    fontWeight: "bold",

    color: APP_COLOR.primary,
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    color: "#444",
    marginBottom: 10,
  },
  featureTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  features: {
    textAlign: "left",
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    height: 125,
  },
  buyNowButton: {
    backgroundColor: APP_COLOR.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buyNowText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PremiumScreen;
