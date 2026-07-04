import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "context/UserContextProvider";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const UnSubPremiumCard = ({ auctionId }) => {
  const { user } = useUser();
  const router = useRouter();

  const handleUpgradePremium = () => {
    if (user?.isLogin) {
      if (Platform.OS !== "ios") {
        router.push({
          pathname: `/premium`,
          params: {
            auctionId: auctionId,
          },
        });
      } else {
        Linking.openURL("https://eauctionshub.com/premium");
      }
    } else {
      router.push({
        pathname: `/login`,
        params: {
          auctionId: auctionId,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.premiumHeader}>
        <View style={styles.premiumHeaderIconBox}>
          <FontAwesome5 name="lock" size={12} color="#EAB308" />
        </View>
        <Text style={styles.premiumHeaderTitle}>Premium Details Preview</Text>
      </View>

      <View style={styles.fieldsList}>
        <LockedField 
          icon="file-alt" 
          title="Loan Account Number:" 
          text="LH••••••••••••" 
        />
        <LockedField 
          icon="user" 
          title="Bank Contact Person:" 
          text="Manager •••••••••••" 
        />
        <LockedField 
          icon="phone-alt" 
          title="Bank Contact Person Phone:" 
          text="+91 98••• ••••" 
        />
        <LockedField 
          icon="map-marker-alt" 
          title="Property Address:" 
          text="Flat No. •••, Royal Residency, Sector ••, Mumbai" 
        />
        <LockedField 
          icon="file-pdf" 
          title="Documents:" 
          text="https://eauctions.com/docs/••••.pdf" 
        />
        <LockedField 
          icon="link" 
          title="Auction URL:" 
          text="https://ibapi.in/auction-details/••••••" 
        />
        <LockedField 
          icon="map-marked-alt" 
          title="Map Location:" 
          text="••••••••••••••••••••••••••••" 
          subTitle="(if provided by bank)"
        />
      </View>

      <View style={styles.upgradeSection}>
        <Text style={styles.upgradeTitle}>Unlock Premium Details</Text>
        <Text style={styles.upgradeSubText}>
          Upgrade to Premium for full access to Bank Manager contact details, official documents, address, and exact location map.
        </Text>

        <TouchableOpacity
          style={styles.upgradeButtonContainer}
          onPress={handleUpgradePremium}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#EAB308", "#CA8A04"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.upgradeButton}
          >
            <FontAwesome5 name="crown" size={13} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.upgradeText}>Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LockedField = ({
  icon,
  title,
  text,
  subTitle = "",
}: {
  icon: string;
  title: string;
  text: string;
  subTitle?: string;
}) => (
  <View style={styles.lockedRow}>
    <View style={styles.lockedIconBox}>
      <FontAwesome5 name={icon as any} size={13} color="#EAB308" />
    </View>
    <View style={styles.lockedTextContainer}>
      <Text style={styles.lockedFieldTitle}>
        {title} {subTitle ? <Text style={styles.lockedFieldSubTitle}>{subTitle}</Text> : null}
      </Text>
      <Text style={styles.lockedFieldValue}>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "rgba(234, 179, 8, 0.15)",
    padding: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 10,
  },
  premiumHeaderIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(234, 179, 8, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  premiumHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1e293b",
  },
  fieldsList: {
    gap: 14,
  },
  lockedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lockedIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(234, 179, 8, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  lockedTextContainer: {
    flex: 1,
    gap: 2,
  },
  lockedFieldTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
  },
  lockedFieldSubTitle: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "500",
  },
  lockedFieldValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(100, 116, 139, 0.06)",
    textShadowColor: "rgba(100, 116, 139, 0.98)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 22,
    opacity: 0.85,
  },
  upgradeSection: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
    marginTop: 16,
    alignItems: "center",
  },
  upgradeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
  },
  upgradeSubText: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 14,
  },
  upgradeButtonContainer: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  upgradeButton: {
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  upgradeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default UnSubPremiumCard;