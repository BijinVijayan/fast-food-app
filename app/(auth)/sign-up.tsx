import { View, Text, Alert } from "react-native";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useState } from "react";
import { createUser } from "@/lib/appwrite";
import SuccessModal from "@/components/modals/SuccessModal";
import useAuthStore from "@/store/auth.store";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const fetchAuthenticatedUser = useAuthStore((s) => s.fetchAuthenticatedUser);

  const submit = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password)
      return Alert.alert(
        "Error",
        "Please enter a valid name, email and password",
      );
    setIsSubmitting(true);

    try {
      await createUser({ name, email, password });
      setShowSuccess(true);
    } catch (error: any) {
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
        placeholder={"Enter your name"}
        label={"Name"}
        value={form.name}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, name: text }))
        }
        keyboardType={"default"}
      />
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
        title={"Sign Up"}
      />
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
      <SuccessModal
        visible={showSuccess}
        message="SignUp successfull"
        subText={"Welcome to your account!."}
        buttonText="Go to Homepage"
        onContinue={handleContinue}
      />
    </View>
  );
};
export default SignUp;
