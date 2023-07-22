import { initializeApp } from 'firebase/app'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage'
import env from '../env/env.variables'

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseBucketUrl,
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

export const uploadImage = async (file: ArrayBuffer, filePath: string) => {
  try {
    const storageRef = ref(storage, filePath)

    await uploadBytes(storageRef, file, {
      contentType: 'image/jpeg',
    })
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getImageUrls = async (filePath: string) => {
  try {
    const storageRef = ref(storage, filePath)
    const imageItems = (await listAll(storageRef)).items
    const downloadUrls = []

    for (let i = 0; i < imageItems.length; i++) {
      const imageUrl = await getDownloadURL(imageItems[i])
      downloadUrls.push(imageUrl)
    }

    return downloadUrls
  } catch (err) {
    throw new Error(err.message)
  }
}

export const updateImages = async (
  filePath: string,
  updatedImages: string | string[],
  newImages: ArrayBuffer[],
) => {
  try {
    const images = Array.isArray(updatedImages)
      ? updatedImages
      : [updatedImages]

    const storageRef = ref(storage, filePath)
    const imageItems = (await listAll(storageRef)).items

    // Remove deleted images from firebase storage
    for (let i = 0; i < imageItems.length; i++) {
      const imageUrl = await getDownloadURL(imageItems[i])

      if (!images.find((image) => image === imageUrl)) {
        await deleteObject(imageItems[i])
      }
    }

    const updatedList = (await listAll(storageRef)).items

    // Upload new images
    for (let i = 0; i < newImages.length; i++) {
      const newImageRef = ref(storage, `${filePath}/${updatedList.length + i}`)

      await uploadBytes(newImageRef, newImages[i], {
        contentType: 'image/jpeg',
      })
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

export const removeReference = async (filePath: string) => {
  try {
    const storageRef = ref(storage, filePath)
    const items = await listAll(storageRef)

    await Promise.all(items.items.map((item) => deleteObject(item)))
  } catch (err) {
    throw new Error(err.message)
  }
}
