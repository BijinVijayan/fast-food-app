import { Redirect, Slot, Tabs } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { TabBarIconProps } from "@/type";
import { Image, View, Text } from "react-native";
import { images } from "@/constants";
import cn from "clsx";
import React from "react";
import { useCartStore } from "@/store/cart.store";
const TabBarIcon = ({
  focused,
  icon,
  title,
  badgeCount = 0,
}: TabBarIconProps & { badgeCount?: number }) => (
  <View className={"tab-icon relative"}>
    <Image
      source={icon}
      className={"size-6"}
      tintColor={focused ? "#fe8c00" : "#5d5f6d"}
      resizeMode={"contain"}
    />
    <Text
      className={cn(
        "text-sm font-bold",
        focused ? "text-primary" : "text-gray-200",
      )}
    >
      {title}
    </Text>
    {badgeCount > 0 && (
      <View className={"cart-badge-tab"}>
        <Text className={"text-white small-bold "}>
          {badgeCount > 9 ? "9+" : badgeCount}
        </Text>
      </View>
    )}
  </View>
);

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  if (!isAuthenticated) return <Redirect href="/sign-in" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 75,
          position: "absolute",
          bottom: 40,
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title={"Home"} icon={images.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title={"Search"}
              icon={images.search}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title={"Cart"}
              icon={images.bag}
              focused={focused}
              badgeCount={totalItems}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title={"Profile"}
              icon={images.person}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
