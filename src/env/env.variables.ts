import dotenv from 'dotenv'

dotenv.config({})

export interface EnvVariables {
  port?: string
  encryptionCode?: string
  jwtSecret?: string
  databaseType?: string
  databaseHost?: string
  databasePort?: string
  databaseUsername?: string
  databasePassword?: string
  databaseName?: string
  firebaseApiKey?: string
  firebaseClientId?: string
  firebaseBucketUrl?: string
  firebaseProjectId?: string
  firebaseAuthDomain?: string
}

const env: EnvVariables = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  encryptionCode: process.env.ENCRYPTION_CODE,
  databaseType: process.env.DATABASE_TYPE,
  databaseHost: process.env.DATABASE_HOST,
  databasePort: process.env.DATABASE_PORT,
  databaseName: process.env.DATABASE_NAME,
  databaseUsername: process.env.DATABASE_USERNAME,
  databasePassword: process.env.DATABASE_PASSWORD,
  firebaseApiKey: process.env.FIREBASE_API_KEY,
  firebaseClientId: process.env.FIREBASE_CLIENT_ID,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseBucketUrl: process.env.FIREBASE_BUCKET_URL,
  firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
}

export default env
