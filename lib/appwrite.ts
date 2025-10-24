import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import {
  CreateUserParams,
  GetMenuDetailsParams,
  GetMenuParams,
  SignInParams,
} from "@/type";
import SignIn from "@/app/(auth)/sign-in";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  platform: "com.ebv.foodordering",
  databaseId: "68f87d9a002607aa789d",
  bucketId: "68f927f1002aadfb3416",
  userCollectionId: "68f87df6002775289e38",
  categoriesCollectionId: "68f920ec0038b403be2a",
  menuCollectionId: "68f921f5002a003396d0",
  customizationCollectionId: "68f924a5001468797090",
  menuCustomizationsCollectionId: "68f925ff00317e88d0e4",
};
export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;
    // console.log(newAccount);

    await signIn({ email, password });
    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl },
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    // Check if a session exists
    const session = await account.getSession("current").catch(() => null);
    if (!session) {
      console.log("No active session found.");
      return null; // Not logged in
    }

    // Fetch the current account details
    const currentAccount = await account.get();
    if (!currentAccount) return null;

    // Get the user document from your users collection
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    return currentUser.documents?.[0] ?? null;
  } catch (e: any) {
    console.log("getCurrentUser error:", e.message);
    return null;
  }
};

export const appwriteLogout = async () => {
  try {
    await account.deleteSession("current");
    console.log("User logged out successfully");
  } catch (e: any) {
    console.log("logout error:", e.message);
    throw new Error(e.message);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];
    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries,
    );

    return menus.documents;
  } catch (e) {
    console.log("getMenu error:", e);
    throw new Error(e as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
    );
    return categories.documents;
  } catch (e: any) {
    throw new Error(e as string);
  }
};

export const getMenuDetails = async ({ $id: menuId }: GetMenuDetailsParams) => {
  try {
    if (!menuId) throw new Error("Menu ID is required");
    const menuDetails = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      menuId,
    );
    // console.log("Menu details found:", menuDetails);
    return menuDetails;
  } catch (e) {
    console.log("getMenuDetails error:", e);
    throw new Error(String(e));
  }
};
