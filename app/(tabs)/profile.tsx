import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { APP_COLOR } from "constants/Colors";
import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "context/UserContextProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Footer from "components/Footer";

const getInitials = (name: string) => {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";
};

const ProfileScreen = () => {
  const { user, setUser } = useUser();
  const isLoggedIn = user?.isLogin;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = 24 + insets.top;

  const username = isLoggedIn ? user.name : "Guest User";
  const phoneNumber = isLoggedIn ? user.phone || "N/A" : "";
  const initials = getInitials(username);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      Toast.show({ type: "success", text1: "Logged Out" });
      setUser({
        id: "",
        name: "",
        phone: "",
        role: "USER",
        isLogin: false,
        isSubscribed: false,
        subscribedPlan: null,
      });
      router.push("/login");
    } catch (e) {
      console.log(e, "error");
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.primary, "#182848"]}
      style={styles.gradientBackground}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingTop: headerHeight }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topContainer}>

          {/* User Profile Card / Guest Card */}
          {isLoggedIn ? (
            <View style={styles.profileCard}>
              <View style={styles.profileMain}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={[APP_COLOR.primary, "#0056b3"]}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.initialsText}>{initials}</Text>
                  </LinearGradient>
                  <View style={styles.avatarBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                  </View>
                </View>
                <View style={styles.userDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText} numberOfLines={1}>
                      {username}
                    </Text>
                    {user?.isSubscribed && (
                      <MaterialCommunityIcons
                        name="crown-circle"
                        size={22}
                        color="gold"
                        style={styles.crownIcon}
                      />
                    )}
                  </View>
                  <Text style={styles.phoneText}>{phoneNumber}</Text>
                  <View style={styles.statusBadge}>
                    <Ionicons
                      name={user?.isSubscribed ? "ribbon" : "person-outline"}
                      size={12}
                      color={user?.isSubscribed ? "#EAB308" : "#64748b"}
                    />
                    <Text style={[styles.statusBadgeText, user?.isSubscribed && { color: "#EAB308" }]}>
                      {user?.isSubscribed ? "Premium Investor" : "Standard Account"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Subscribed Plan Banner or Upgrade Callout */}
              {user?.isSubscribed ? (
                <View style={styles.premiumBanner}>
                  <Ionicons name="sparkles" size={18} color="#EAB308" />
                  <View style={styles.premiumBannerTextContainer}>
                    <Text style={styles.premiumBannerTitle}>Premium Active</Text>
                    <Text style={styles.premiumBannerSub}>
                      Unlimited access to detailed bank auction listings.
                    </Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.upgradeBanner}
                  activeOpacity={0.9}
                  onPress={() => router.push("/premium")}
                >
                  <LinearGradient
                    colors={["#EAB308", "#CA8A04"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.upgradeGradient}
                  >
                    <Ionicons name="star" size={16} color="#fff" />
                    <View style={styles.upgradeTextContainer}>
                      <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                      <Text style={styles.upgradeSub}>
                        Get contact info, auto-notifications & priority support.
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.guestCard}>
              <View style={styles.guestCardHeader}>
                <Ionicons name="sparkles" size={20} color="#FFD700" />
                <Text style={styles.guestCardTitle}>Unlock Full Benefits</Text>
              </View>
              <Text style={styles.guestCardDesc}>
                Create an account or login to access exclusive features:
              </Text>

              <View style={styles.benefitsList}>
                <View style={styles.benefitRow}>
                  <View style={styles.benefitIconWrapper}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                  </View>
                  <Text style={styles.benefitText}>Save and track favorite auctions</Text>
                </View>
                <View style={styles.benefitRow}>
                  <View style={styles.benefitIconWrapper}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                  </View>
                  <Text style={styles.benefitText}>Get immediate contact access for deals</Text>
                </View>
                <View style={styles.benefitRow}>
                  <View style={styles.benefitIconWrapper}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                  </View>
                  <Text style={styles.benefitText}>Custom instant search notifications</Text>
                </View>
              </View>
            </View>
          )}

          {/* Menu Sections */}
          <View style={styles.menuContainer}>
            {/* Workspace & Services */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>WORKSPACE & SERVICES</Text>
              <View style={styles.menuCard}>
                {Platform.OS !== "ios" && (
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => router.push("/premium")}
                  >
                    <View style={styles.menuRowLeft}>
                      <View style={[styles.menuIconBox, { backgroundColor: "rgba(234, 179, 8, 0.1)" }]}>
                        <Ionicons name="star" size={18} color="#EAB308" />
                      </View>
                      <Text style={styles.menuRowText}>Premium Plans</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                  </TouchableOpacity>
                )}

                {isLoggedIn && (
                  <>
                    {Platform.OS !== "ios" && <View style={styles.rowDivider} />}
                    <TouchableOpacity
                      style={styles.menuRow}
                      onPress={() => router.push("/favourite")}
                    >
                      <View style={styles.menuRowLeft}>
                        <View style={[styles.menuIconBox, { backgroundColor: "rgba(239, 68, 68, 0.1)" }]}>
                          <Ionicons name="heart" size={18} color="#EF4444" />
                        </View>
                        <Text style={styles.menuRowText}>Favorite Auctions</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <View style={styles.rowDivider} />
                    <TouchableOpacity
                      style={styles.menuRow}
                      onPress={() => router.push("/setting")}
                    >
                      <View style={styles.menuRowLeft}>
                        <View style={[styles.menuIconBox, { backgroundColor: "rgba(14, 165, 233, 0.1)" }]}>
                          <Ionicons name="settings" size={18} color="#0EA5E9" />
                        </View>
                        <Text style={styles.menuRowText}>Settings</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* Information & Support */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>INFORMATION & SUPPORT</Text>
              <View style={styles.menuCard}>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => router.push("/about")}
                >
                  <View style={styles.menuRowLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: "rgba(99, 102, 241, 0.1)" }]}>
                      <Ionicons name="information-circle" size={18} color="#6366F1" />
                    </View>
                    <Text style={styles.menuRowText}>About E-AuctionsHub</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </TouchableOpacity>

                <View style={styles.rowDivider} />

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => router.push("/contact")}
                >
                  <View style={styles.menuRowLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
                      <Ionicons name="call" size={18} color="#10B981" />
                    </View>
                    <Text style={styles.menuRowText}>Contact Support</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Legal & Security */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>LEGAL & SECURITY</Text>
              <View style={styles.menuCard}>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => router.push("/termsAndConditions")}
                >
                  <View style={styles.menuRowLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: "rgba(100, 116, 139, 0.1)" }]}>
                      <Ionicons name="document-text" size={18} color="#64748B" />
                    </View>
                    <Text style={styles.menuRowText}>Terms & Conditions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </TouchableOpacity>

                <View style={styles.rowDivider} />

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => router.push("/privacyAndPolicy")}
                >
                  <View style={styles.menuRowLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: "rgba(139, 92, 246, 0.1)" }]}>
                      <Ionicons name="shield-checkmark" size={18} color="#8B5CF6" />
                    </View>
                    <Text style={styles.menuRowText}>Privacy & Policy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Auth Action Buttons */}
          <View style={styles.authButtonsContainer}>
            {!isLoggedIn ? (
              <View style={styles.guestButtonsGroup}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.primaryAuthButton}
                  onPress={() => router.push("/login")}
                >
                  <LinearGradient
                    colors={[APP_COLOR.primary, "#0056b3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientAuthButton}
                  >
                    <AntDesign name="login" size={16} color="white" />
                    <Text style={styles.primaryAuthButtonText}>Login</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.outlineAuthButton}
                  onPress={() => router.push("/signup")}
                >
                  <MaterialCommunityIcons name="account-plus-outline" size={16} color="#ffffff" />
                  <Text style={styles.outlineAuthButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <AntDesign name="logout" size={16} color="#EF4444" />
                <Text style={styles.logoutButtonText}>Log Out Account</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Footer />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topContainer: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 40,
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
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
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#ffffff",
    lineHeight: 28,
  },
  headerTextAccent: {
    color: "#FFD700",
    fontWeight: "900",
    textShadowColor: "rgba(255, 215, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  headerDivider: {
    width: 40,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 20,
    gap: 14,
  },
  profileMain: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatarGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  initialsText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  avatarBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 1,
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    flexShrink: 1,
  },
  crownIcon: {
    marginLeft: 2,
  },
  phoneText: {
    fontSize: 13,
    color: "#64748b",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginTop: 4,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748b",
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(234, 179, 8, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.25)",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  premiumBannerTextContainer: {
    flex: 1,
    gap: 2,
  },
  premiumBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#CA8A04",
  },
  premiumBannerSub: {
    fontSize: 11,
    color: "#854D0E",
    lineHeight: 14,
  },
  upgradeBanner: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  upgradeTextContainer: {
    flex: 1,
    gap: 2,
  },
  upgradeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  upgradeSub: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 13,
  },
  guestCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 20,
    gap: 12,
  },
  guestCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guestCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  guestCardDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  benefitsList: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  benefitText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  menuContainer: {
    width: "100%",
    gap: 16,
  },
  menuSection: {
    width: "100%",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: 1,
    paddingLeft: 4,
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  menuRowText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginLeft: 60,
  },
  authButtonsContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
  guestButtonsGroup: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  primaryAuthButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: APP_COLOR.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientAuthButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryAuthButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  outlineAuthButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  outlineAuthButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  logoutButton: {
    width: "100%",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(239, 68, 68, 0.25)",
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ProfileScreen;
