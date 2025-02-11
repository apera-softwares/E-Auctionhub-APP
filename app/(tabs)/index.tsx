import { APP_COLOR } from "constants/Colors";
import { H3, Image, SizableText, Text, View, YStack } from "tamagui";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { useState } from "react";

export default function TabOneScreen() {
  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

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
        {/* Overlay for text */}
        <View
          px="$4"
          bg="rgba(0,0,0,0.5)"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <H3 style={{ fontWeight: 700, textAlign: "center", color: "white" }}>
            Your Trusted Place{" "}
            <Text style={{ color: APP_COLOR.primary, fontWeight: 700 }}>
              for Auctioned Assets
            </Text>
          </H3>
          <SizableText size="$5" text="center" color="white">
            Find your next great investment with our exclusive bank auction
            listings, all at your fingertips.
          </SizableText>
          <View style={styles.container}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select item" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
          />
          
        </View>
        </View>
       
      </View>
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    width:"100%"
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
