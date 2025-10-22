import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function _Layout() {
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <Text>Auth Layout</Text>
      <Slot />
    </SafeAreaView>
  );
}
