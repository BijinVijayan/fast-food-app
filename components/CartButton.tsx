import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { router } from "expo-router";

const CartButton = () => {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  return (
    <TouchableOpacity
      className={"cart-btn"}
      onPress={() => router.push("/cart")}
    >
      <Image source={images.bag} className={"size-5"} resizeMode={"contain"} />
      {totalItems > 0 && (
        <View className={"cart-badge"}>
          <Text className={"text-white small-bold "}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
export default CartButton;
