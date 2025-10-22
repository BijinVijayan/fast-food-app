import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "@/constants";

const CartButton = () => {
  const totalItemsCount = 5;
  return (
    <TouchableOpacity className={"cart-btn"} onPress={() => {}}>
      <Image source={images.bag} className={"size-5"} resizeMode={"contain"} />
      {totalItemsCount > 0 && (
        <View className={"cart-badge"}>
          <Text className={"text-white small-bold "}>{totalItemsCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
export default CartButton;
