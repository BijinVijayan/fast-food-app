import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

const Searchbar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce logic (wait 500ms after typing stops)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  // Trigger search whenever debounced value changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.setParams({ query: debouncedQuery });
    } else {
      router.setParams({ query: undefined });
    }
  }, [debouncedQuery]);

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      router.setParams({ query });
    }
  };

  return (
    <View className="searchbar">
      <TextInput
        className="flex-1 p-5"
        placeholder="Search for pizzas, burgers..."
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        placeholderTextColor="#A0A0A0"
        returnKeyType="search"
      />
      <TouchableOpacity className="pr-5" onPress={handleSubmit}>
        <Image
          source={images.search}
          className="size-6"
          resizeMode="contain"
          tintColor="#5D5F6D"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Searchbar;
