import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import env from "../env/env.variables";

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseBucketUrl,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


export const uploadImage = async (file: ArrayBuffer, filePath: string) => {
  try {
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file, {
      contentType: "image/jpeg",
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getImageUrls = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    const imageItems = (await listAll(storageRef)).items;
    const downloadUrls = [];

    for (let i = 0; i < imageItems.length; i++) {
      const imageUrl = await getDownloadURL(imageItems[i]);
      downloadUrls.push(imageUrl);
    }

    return downloadUrls;
  } catch (err) {
    throw new Error(err.message);
  }
};
