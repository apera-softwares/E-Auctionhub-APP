import { BACKEND_API } from "constants/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  getHash,
  startOtpListener,
  removeListener,
  useOtpVerify,
} from "react-native-otp-verify";

const CELL_COUNT = 4;
const VerifyOtp = () => {
  const { phone, from } = useLocalSearchParams() as any;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      getHash()
        .then((hash) => {
          console.log("hash", hash);
        })
        .catch((error) => {
          console.error("Error occurred while getting hash:", error);
        });

      startOtpListener((message) => {
        // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
        if (!message.includes("Timeout Error")) {
          const match = /(\d{4})/.exec(message);
          if (match && match[1]) {
            const otp = match[1];
            setValue(otp);
          }
          console.log("message", message);
        } else {
          Toast.show({
            type: "error",
            text1: "Unable to detect otp. Please  enter manually",
          });
        }
      });
    }

    return () => {
      if (Platform.OS === "android") {
        removeListener();
      }
    };
  }, []);

  // const handleOtpChange = (text: string) => {
  //   if (/^\d{0,4}$/.test(text)) {
  //     setOtp(text);
  //     if (text.length === 4) Keyboard.dismiss();
  //   }
  // };

  const handleVerifyOtp = async () => {
    if (value.length !== 4) return;
    setLoading(true);
    try {
      const payload = {
        phone: phone,
        otp: value,
      };

      const response = await fetch(`${BACKEND_API}user/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        Toast.show({ type: "success", text1: "OTP Verified Succesfully" });
        if (from == "login" || from == "profile") {
          router.push({
            pathname: `/changePassword`,
            params: { from: from, phone: phone },
          });
        } else {
          router.push({
            pathname: `/login`,
          });
        }
      } else if (data.statusCode === 400) {
        Toast.show({ type: "error", text1: data.message });
      } else if (data.statusCode === 404) {
        Toast.show({ type: "error", text1: data.message });
      } else {
        Toast.show({ type: "error", text1: data.message });
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Toast />

      <View style={styles.card}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>We've sent a code to your number </Text>

        {/* <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
          value={otp}
          onChangeText={handleOtpChange}
          placeholder="----"
          placeholderTextColor="#aaa"
          textAlign="center"
        /> */}
        <View>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleVerifyOtp}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fafdff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#2575fc",
    borderRadius: 10,
    fontSize: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: 170,
    textAlign: "center",
    letterSpacing: 8,
    marginTop: 10,
    color: "#333",
    backgroundColor: "#f8f9fc",
  },
  button: {
    backgroundColor: "#2575fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#2575fc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  codeFiledRoot: { marginTop: 16 },
  cell: {
    width: 48,
    height: 48,
    lineHeight: 48,
    fontSize: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 8,
  },
  focusCell: {
    borderColor: "#2575fc",
  },
});

export default VerifyOtp;
