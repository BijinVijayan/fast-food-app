import { View, Text, Button, Alert } from "react-native";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useState } from "react";
import { signIn } from "@/lib/appwrite";
import * as Sentry from "@sentry/react-native";
import SuccessModal from "@/components/modals/SuccessModal";
import useAuthStore from "@/store/auth.store";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const fetchAuthenticatedUser = useAuthStore((s) => s.fetchAuthenticatedUser);

  const submit = async () => {
    const { email, password } = form;
    if (!email || !password)
      return Alert.alert("Error", "Please enter a valid email and password");
    setIsSubmitting(true);

    try {
      await signIn({ email, password });
      setShowSuccess(true);
    } catch (error: any) {
      // Sentry.captureEvent(error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    setShowSuccess(false);
    await fetchAuthenticatedUser();
    router.replace("/");
  };
  return (
    <View className={"gap-10 bg-white rounded-lg p-5 mt-6"}>
      <CustomInput
        placeholder={"Enter your email"}
        label={"Email"}
        value={form.email}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, email: text }))
        }
        keyboardType={"email-address"}
      />
      <CustomInput
        placeholder={"Enter your password"}
        value={form.password}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label={"Password"}
        secureTextEntry={true}
      />
      <CustomButton
        isLoading={isSubmitting}
        onPress={submit}
        title={"Sign In"}
      />
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don't have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
      <SuccessModal
        visible={showSuccess}
        message="SignIn successfull"
        subText={"You’re all set to continue where you left off."}
        buttonText="Go to Homepage"
        onContinue={handleContinue}
      />
    </View>
  );
};
export default SignIn;
