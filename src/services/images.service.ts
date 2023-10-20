import fs from 'fs'
import { rimraf } from 'rimraf'
import { initializeApp } from 'firebase/app'
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
} from 'firebase/storage'
import env from '../env/env.variables'
import axios from 'axios'

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseBucketUrl,
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

const path = `src/uploads`

export const uploadImage = (file: ArrayBuffer, folder: string | number) => {
  const folderPath = `${path}/${folder}`

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
  const fileName = Date.now().toString() + Math.random()
  fs.appendFile(
    `${folderPath}/${fileName}.png`,
    Buffer.from(file),
    (err) => err && console.log(err),
  )
}

export const getImageUrls = (folder: string | number) => {
  const folderPath = `${path}/${folder}`
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err)
      } else {
        const imageItems: string[] = files.map(
          (fileName) => `uploads/${folder}/${fileName}`,
        )
        resolve(imageItems)
      }
    })
  })
}

export const getFirebaseImages = async (id: string | number) => {
  try {
    const storageRef = ref(storage, 'products/' + id)
    const imageItems = (await listAll(storageRef)).items
    const downloadUrls = []

    for (let i = 0; i < imageItems.length; i++) {
      const imageUrl = await getDownloadURL(imageItems[i])
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      
      const arrayBuffer = response.data;
      await uploadImage(arrayBuffer, id)
    }

    return downloadUrls
  } catch (err) {
    throw new Error(err.message)
  }
}

export const updateImages = async (
  folder: string,
  updatedImages: string | string[],
  newImages: ArrayBuffer[],
) => {
  const folderPath = `${path}/${folder}`

  // Remove deleted images
  const updatingArray = Array.isArray(updatedImages)
    ? updatedImages
    : [updatedImages]

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.log(err)
    } else {
      files.forEach((fileName) => {
        if (
          !updatingArray.some(
            (updatingFile) =>
              updatingFile === `${folderPath.slice(4)}/${fileName}`,
          )
        ) {
          fs.rm(`${folderPath}/${fileName}`, (err) => err && console.log(err))
        }
      })
    }
  })

  // Upload new images
  for (let i = 0; i < newImages.length; i++) {
    uploadImage(newImages[i], folder)
  }
}

export const removeReference = async (folder: string | number) => {
  rimraf(`${path}/${folder}`)
}
