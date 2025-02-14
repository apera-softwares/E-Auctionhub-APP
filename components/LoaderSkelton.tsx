import { APP_COLOR } from "constants/Colors";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const LoaderSkelton = () => {
  return <ActivityIndicator size="large" color={APP_COLOR.primary} />;
};

export default LoaderSkelton;
