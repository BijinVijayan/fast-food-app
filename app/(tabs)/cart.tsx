import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { PaymentInfoStripeProps } from "@/type";
import cn from "clsx";
import CartItem from "@/components/CartItem";
import { StripeProvider } from "@stripe/stripe-react-native";
import Checkout from "@/components/Checkout";

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

const Cart = () => {
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.food.com"
      urlScheme="fastfood"
    >
      <SafeAreaView className={"bg-neutral-50 h-full"}>
        <FlatList
          data={items}
          renderItem={({ item }) => <CartItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerClassName={"pb-40 px-5 pt-5"}
          ListHeaderComponent={() => (
            <View>
              <CustomHeader title={"Your Cart"} />
              {totalItems > 0 && (
                <View className={"flex-row justify-between items-center mb-5"}>
                  <View>
                    <Text className={"small-bold uppercase text-primary"}>
                      DELIVERY LOCATION
                    </Text>
                    <Text className={"base-bold"}>Home</Text>
                  </View>
                  <TouchableOpacity
                    className={
                      "border border-primary px-4  py-2.5 rounded-full"
                    }
                    onPress={() => {}}
                  >
                    <Text className={"small-bold text-primary"}>
                      Change Location
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center px-10 py-14">
              <Image
                source={images.emptyCart}
                className="w-64 h-64 opacity-90 mb-6"
                resizeMode="contain"
              />
              <Text className="text-gray-600 text-lg font-medium text-center">
                Your Cart is empty.
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Try Add Something Yummy 🍔
              </Text>
            </View>
          )}
          ListFooterComponent={() =>
            totalItems > 0 && (
              <View className="gap-5">
                <View className="mt-5 border bg-white border-[#EDEDED] p-5 rounded-2xl">
                  <Text className="h3-bold text-dark-100 mb-5">
                    Payment Summary
                  </Text>
                  <PaymentInfoStripe
                    label={`Total Items (${totalItems})`}
                    value={`$${totalPrice.toFixed(2)}`}
                  />
                  <PaymentInfoStripe label={`Delivery Fee`} value={`$5.00`} />
                  <PaymentInfoStripe
                    label={`Discount`}
                    value={`- $0.50`}
                    valueStyle="!text-success"
                  />
                  <View className="border-t border-[#EDEDED] my-2" />
                  <PaymentInfoStripe
                    label={`Total`}
                    value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                    labelStyle="base-bold !text-dark-100"
                    valueStyle="base-bold !text-dark-100 !text-right"
                  />
                </View>

                {/*<CustomButton title="Order Now" />*/}
                <Checkout
                  fullName={"Bijin EV"}
                  email={"bijinev55@gmail.com"}
                  amount={"1000"}
                  driverAddress={"Eettikkunnal house"}
                />
              </View>
            )
          }
        />
      </SafeAreaView>
    </StripeProvider>
  );
};
export default Cart;
