import {
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import React from "react";
import { Redirect, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { images } from "@/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useAuthStore from "@/store/auth.store";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (isAuthenticated) return <Redirect href="/" />;
  return (
    <KeyboardAwareScrollView
      className="bg-white flex-1"
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={2}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/*<StatusBar style="dark" />*/}
      <ScrollView
        className={"bg-white"}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          className={"w-full relative"}
          style={{ height: Dimensions.get("screen").height / 2.25 }}
        >
          <ImageBackground
            source={images.loginGraphic}
            className={"size-full rounded-b-lg"}
            resizeMode={"stretch"}
          />
          <Image
            source={images.logo}
            className={"self-center size-48 absolute -bottom-16 z-10"}
          />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
