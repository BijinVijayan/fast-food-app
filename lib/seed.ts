import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";
import * as FileSystem from "expo-file-system/legacy";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(collectionId: string) {
  try {
    console.log(`Clearing collection: ${collectionId}`);
    const list = await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionId,
    );
    await Promise.all(
      list.documents.map((doc) =>
        databases.deleteDocument(
          appwriteConfig.databaseId,
          collectionId,
          doc.$id,
        ),
      ),
    );
    console.log(`✅ Cleared collection: ${collectionId}`);
  } catch (err) {
    console.error(`❌ Failed to clear collection ${collectionId}:`, err);
  }
}

async function clearStorage() {
  try {
    console.log(`Clearing storage bucket: ${appwriteConfig.bucketId}`);
    const list = await storage.listFiles(appwriteConfig.bucketId);
    await Promise.all(
      list.files.map((file) =>
        storage.deleteFile(appwriteConfig.bucketId, file.$id),
      ),
    );
    console.log(`✅ Cleared storage bucket`);
  } catch (err) {
    console.error("❌ Failed to clear storage:", err);
  }
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    console.log("Downloading image:", imageUrl);

    const localPath = FileSystem.cacheDirectory + `${Date.now()}.jpg`;
    const downloadResult = await FileSystem.downloadAsync(imageUrl, localPath);
    console.log("Downloaded to:", downloadResult.uri);

    const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
    console.log("File info:", fileInfo);

    if (!fileInfo.exists) {
      throw new Error(`File not found at ${downloadResult.uri}`);
    }

    const fileObj = {
      name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
      type: "image/jpeg",
      size: fileInfo.size ?? 0, // <-- use nullish coalescing
      uri: downloadResult.uri,
    };

    console.log("Uploading file to Appwrite:", fileObj.name);
    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj,
    );
    console.log("Uploaded file:", uploadedFile.$id);

    return storage.getFileViewURL(appwriteConfig.bucketId, uploadedFile.$id);
  } catch (err) {
    console.error("❌ uploadImageToStorage error:", err);
    throw err;
  }
}

async function seed() {
  try {
    console.log("Starting seed process...");

    // 1. Clear all collections and storage
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    console.log("Creating categories...");
    for (const cat of data.categories) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        ID.unique(),
        cat,
      );
      categoryMap[cat.name] = doc.$id;
      console.log(`✅ Created category ${cat.name} -> ${doc.$id}`);
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    console.log("Creating customizations...");
    for (const cus of data.customizations) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.customizationCollectionId,
        ID.unique(),
        cus,
      );
      customizationMap[cus.name] = doc.$id;
      console.log(`✅ Created customization ${cus.name} -> ${doc.$id}`);
    }

    // 4. Create Menu Items
    console.log("Creating menu items...");
    for (const item of data.menu) {
      const uploadedImage = await uploadImageToStorage(item.image_url);

      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: uploadedImage,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        },
      );

      console.log(`✅ Created menu item ${item.name} -> ${doc.$id}`);

      // 5. Create menu_customizations
      for (const cusName of item.customizations) {
        const menuCusDoc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCustomizationsCollectionId,
          ID.unique(),
          {
            menu: doc.$id,
            customizations: customizationMap[cusName],
          },
        );
        console.log(`   ↳ Added customization ${cusName} -> ${menuCusDoc.$id}`);
      }
    }

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Failed to seed:", err);
  }
}

export default seed;
