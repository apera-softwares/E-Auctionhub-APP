import React, { useState } from "react";
import { View, Image, TouchableOpacity, ScrollView, Dimensions, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const ImageFullScreenScreen = () => {
    const { images } = useLocalSearchParams() as any;
    const router = useRouter();
    const parsedImages = typeof images === "string" ? JSON.parse(images) : images;

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <FontAwesome name="close" size={24} color="white" />
            </TouchableOpacity>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {Array.isArray(parsedImages) &&
                    parsedImages.map((img: string, index: number) => (
                        <Image key={index} source={{ uri: img }} style={styles.fullScreenImage} />
                    ))}
            </ScrollView>

            <View style={styles.pagination}>
                <Text style={styles.paginationText}>
                    {currentIndex + 1}/{parsedImages.length}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: "50%",
    },
    fullScreenImage: {
        width,
        height,
        resizeMode: "contain",
    },
    pagination: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    paginationText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ImageFullScreenScreen;
