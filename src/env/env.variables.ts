import dotenv from "dotenv";

dotenv.config({});

export interface EnvVariables {
  port?: string;
  firebaseApiKey?: string;
  firebaseClientId?: string;
  firebaseBucketUrl?: string;
  firebaseProjectId?: string;
  firebaseAuthDomain?: string;
}

const env: EnvVariables = {
  port: process.env.PORT,
  firebaseApiKey: process.env.FIREBASE_API_KEY,
  firebaseClientId: process.env.FIREBASE_CLIENT_ID,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseBucketUrl: process.env.FIREBASE_BUCKET_URL,
  firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
};

export default env;
