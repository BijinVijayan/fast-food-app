import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getMenuDetails } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import { MenuItem } from "@/type";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";

const MenuDetails = () => {
  const { id } = useLocalSearchParams();
  const { addItem } = useCartStore();

  const { data, loading, error } = useAppwrite({
    fn: getMenuDetails,
    params: { $id: id as string },
    skip: !id,
  });
  const menu = data as unknown as MenuItem;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error || !menu) {
    return (
      <View className="flex-1 justify-center items-center base-bold">
        <Text>{error || "No menu details found"}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-5 relative">
      <TouchableOpacity
        className={
          "absolute bottom-10 mx-5 bg-primary w-full rounded-full px-6 py-3.5"
        }
        onPress={() =>
          addItem({
            id: menu.$id,
            name: menu.name,
            price: menu.price,
            image_url: menu.image_url,
            customizations: [],
          })
        }
      >
        <Text className={"base-semibold text-center text-white"}>
          Add to Cart +
        </Text>
      </TouchableOpacity>
      <CustomHeader />
      <View className="flex-row justify-between items-start">
        {/* Left Column */}
        <View className="flex-1 pr-3">
          <Text className="h2-bold text-dark-100 mb-2">{menu.name}</Text>
          <Text className={"body-medium text-gray-200 mb-3"}>
            {"Category Name"}
          </Text>
          <View className="flex-row items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Image
                key={index}
                source={images.star}
                className={`w-4 h-4 ${index < menu.rating ? "opacity-100" : "opacity-30"}`}
                resizeMode="contain"
              />
            ))}
            <Text className="paragraph-medium text-gray-200 ml-2">
              {menu.rating}/5
            </Text>
          </View>
          <Text className="h2-bold  mt-4">
            <Text className={"text-primary"}>$ </Text>
            {menu.price ?? "N/A"}
          </Text>
          <View className="flex-row items-center gap-x-5 mt-8">
            <View>
              <Text className={"text-gray-200 body-medium"}>Calories</Text>
              <Text className={"text-dark-100 paragraph-semibold"}>
                {menu.calories} Cal
              </Text>
            </View>
            <View>
              <Text className={"text-gray-200 body-medium"}>Protein</Text>
              <Text className={"text-dark-100 paragraph-semibold"}>
                {menu.protein} g
              </Text>
            </View>
          </View>
        </View>

        {/* Right Column */}
        <View className="flex-1 relative">
          {menu.image_url && (
            <Image
              source={{ uri: menu.image_url }}
              className="w-[290px] h-[300px] absolute top-0 -right-24  z-10"
              resizeMode="contain"
            />
          )}
        </View>
      </View>
      <View
        className={
          "mt-20 bg-[#FE8C000D] py-3 px-6 rounded-full flex-row items-center justify-between"
        }
      >
        <View className={"flex-row items-center justify-center gap-2"}>
          <Image
            source={images.dollar}
            className={"size-7"}
            resizeMode={"contain"}
          />
          <Text className={"text-dark-100 text-sm font-quicksand-semibold"}>
            Free Delivery
          </Text>
        </View>
        <View className={"flex-row items-center justify-center gap-2"}>
          <Image
            source={images.clock}
            className={"size-4"}
            resizeMode={"contain"}
          />
          <Text className={"text-dark-100 text-sm font-quicksand-semibold"}>
            20 - 30 mins
          </Text>
        </View>
        <View className={"flex-row items-center justify-center gap-2"}>
          <Image
            source={images.star}
            className={"size-5"}
            resizeMode={"contain"}
          />
          <Text className={"text-dark-100 text-sm font-quicksand-semibold"}>
            4.5
          </Text>
        </View>
      </View>
      {menu.description ? (
        <View className={"mt-6"}>
          <Text className="text-gray-200 paragraph-medium mb-4">
            {menu.description}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default MenuDetails;
