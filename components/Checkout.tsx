import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import { Alert, Image, Text, View } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { images } from "@/constants";
import { router } from "expo-router";
import ReactNativeModal from "react-native-modal";
import { useCartStore } from "@/store/cart.store";

const Checkout = ({ fullName, email, amount }: any) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initializePaymentSheet = async () => {
    // console.log("Step 1: Fetching PaymentIntent from backend...");
    const response = await fetchAPI("/(api)/(stripe)/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName || email.split("@")[0],
        email,
        amount,
      }),
    });

    // console.log("Step 2: /create response →", response);

    const { paymentIntent, ephemeralKey, customer } = response;

    if (!paymentIntent || !ephemeralKey || !customer) {
      throw new Error("Missing Stripe parameters from backend");
    }

    // console.log("Step 3: Initializing PaymentSheet...");
    const { error } = await initPaymentSheet({
      merchantDisplayName: "FoodBee Private Limited",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: false,
      // returnURL: "fastfood://(tab)/cart",
    });

    if (error) throw new Error(error.message);

    // console.log("Step 4: PaymentSheet initialized successfully");
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    try {
      await initializePaymentSheet();
      // console.log("Step 5: Presenting Payment Sheet...");
      const { error } = await presentPaymentSheet();
      if (error) {
        // console.log("PaymentSheet error:", error);
        Alert.alert("Payment Error", error.message);
      } else {
        // console.log("Payment completed successfully!");
        setSuccess(true);
      }
    } catch (err: any) {
      // console.error("Payment Flow Error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomButton
        title="Checkout"
        style="my-10"
        onPress={openPaymentSheet}
        isLoading={loading}
      />

      <ReactNativeModal
        isVisible={success}
        animationIn="slideInUp"
        backdropOpacity={0.5}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image
            source={images.check}
            className="w-20 h-20 mt-5"
            resizeMode="contain"
          />
          <Text className="text-xl text-center font-JakartaBold my-5">
            Products Checked Out Successfully
          </Text>
          <CustomButton
            title="Home"
            onPress={() => {
              setSuccess(false);
              clearCart();
              router.push("/");
            }}
            style="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Checkout;
