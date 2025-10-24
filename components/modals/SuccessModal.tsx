import React, { useEffect, useRef } from "react";
import {
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { images } from "@/constants";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  message: string;
  buttonText?: string;
  subText?: string;
  onContinue: () => void;
};

const SuccessModal = ({
  visible,
  message,
  subText,
  buttonText = "Continue",
  onContinue,
}: Props) => {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* 1️⃣ Blur overlay covering entire screen */}
      <View className="absolute inset-0">
        <BlurView
          intensity={5}
          tint="light"
          className="absolute inset-0"
          experimentalBlurMethod="dimezisBlurView"
        />
        {/* Optional soft dim for depth */}
        <View className="absolute inset-0 bg-black/10" />
      </View>

      {/* 2️⃣ Animated modal card */}
      <View className="flex-1 justify-end">
        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="bg-white rounded-t-3xl px-6 py-10 items-center shadow-2xl"
        >
          {/* Success illustration */}
          <View className="w-full flex justify-center items-center mb-10">
            <Image
              source={images.success}
              className="w-60 h-44"
              resizeMode="contain"
            />
          </View>

          {/* Texts */}
          <Text className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            {message}
          </Text>

          <Text className="text-gray-500 text-center mb-8 px-4 leading-5">
            {subText}
          </Text>

          {/* Button */}
          <TouchableOpacity
            onPress={onContinue}
            activeOpacity={0.9}
            className="bg-primary rounded-full py-4 w-full"
          >
            <Text className="text-white font-semibold text-center text-lg">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
