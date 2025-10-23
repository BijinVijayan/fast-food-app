import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import useAuthStore from "@/store/auth.store";
import { images } from "@/constants";
import { ProfileDetailsProps } from "@/type";
import { router } from "expo-router";

const Detail = ({ icon, heading, value }: ProfileDetailsProps) => (
  <View className={"flex-row justify-start items-center gap-x-4"}>
    <View
      className={
        "bg-[#FE8C000D] w-12 h-12 rounded-full flex items-center justify-center border border-[#FE8C001D]"
      }
    >
      <Image className={"size-5"} source={icon} />
    </View>
    <View className={""}>
      <Text className={"text-sm font-quicksand-medium text-gray-200"}>
        {heading}
      </Text>
      <Text className={"text-base font-quicksand-semibold"}>{value}</Text>
    </View>
  </View>
);

const Profile = () => {
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/sign-in");
          },
        },
      ],
      { cancelable: true },
    );
  };
  // console.log("user details", user);
  return (
    <SafeAreaView className={"bg-neutral-50 h-full px-5 pt-5 "}>
      <CustomHeader title={"Profile"} />
      <View className={"flex justify-center items-center mt-1"}>
        <View className={"relative"}>
          <View
            className={
              "absolute bottom-0 right-1 z-10 flex justify-center items-center bg-primary rounded-full w-8 h-8 border border-white"
            }
          >
            <Image
              source={images.pencil}
              className={"size-4"}
              resizeMode="contain"
            />
          </View>
          <Image
            source={{ uri: user?.avatar }}
            className={"w-[100px] h-[100px] object-cover rounded-full"}
          />
        </View>
      </View>
      <View
        style={{ elevation: 0.3 }}
        className={
          "flex flex-col gap-y-7 justify-center bg-white py-5 px-3.5 rounded-[20px] my-8"
        }
      >
        <Detail icon={images.user} heading={"Full Name"} value={user?.name} />
        <Detail icon={images.envelope} heading={"Email"} value={user?.email} />
        <Detail
          icon={images.phone}
          heading={"Phone number"}
          value={"+91 8129667932"}
        />
        <Detail
          icon={images.location}
          heading={"Address 1 - (Home)"}
          value={"123 Main Street, Springfield, IL 62704"}
        />
        <Detail
          icon={images.location}
          heading={"Address 2 - (Work)"}
          value={"221B Rose Street, Foodville, FL 12345"}
        />
      </View>
      <View className={"flex flex-col gap-y-5"}>
        <TouchableOpacity
          className={
            "w-full rounded-full border border-[#FE8C00] py-3.5 px-4 bg-[#FE8C000D]"
          }
          onPress={() => {}}
        >
          <Text className={"paragraph-bold text-center text-primary"}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={
            "w-full rounded-full border border-[#F14141] py-3.5 px-4 bg-[#F141410D]"
          }
          onPress={handleLogout}
        >
          <View className={"flex flex-row gap-2 items-center justify-center"}>
            <Image source={images.logout} className={"size-6"} />
            <Text className={"paragraph-bold text-center text-[#F14141]"}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Profile;
