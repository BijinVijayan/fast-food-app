import { FlatList, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import cn from "clsx";
import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import { Category, MenuItem } from "@/type";
import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: 6 },
  });

  // console.log("menu data", JSON.stringify(data, null, 2));
  const { data: categories } = useAppwrite({ fn: getCategories });
  // console.log("categories", JSON.stringify(categories, null, 2));

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  return (
    <SafeAreaView className={"bg-white h-full"}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isFirstRightColItem ? "mt-10" : "mt-0",
              )}
            >
              <MenuCard item={item as unknown as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        columnWrapperClassName={"gap-7"}
        numColumns={2}
        contentContainerClassName={"gap-8 px-5 pb-36"}
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  SEARCH
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    Find your favorite food
                  </Text>
                </View>
              </View>
              <CartButton />
            </View>

            <SearchBar />
            <Filter categories={categories as unknown as Category[]} />
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && (
            <View className="flex-1 items-center justify-center px-10 py-14">
              <Image
                source={images.emptyState}
                className="w-64 h-64 opacity-90 mb-6"
                resizeMode="contain"
              />
              <Text className="text-gray-600 text-lg font-medium text-center">
                No results found
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Try searching for something else 🍔
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};
export default Search;
