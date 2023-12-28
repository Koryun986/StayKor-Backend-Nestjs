export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONT_END_URL,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name:
      process.env.NODE_ENV == "test"
        ? process.env.DATABASE_TEST
        : process.env.DATABASE_NAME,
  },
  jwt: {
    secret:
      process.env.NODE_ENV == "test"
        ? "test secret"
        : process.env.JWT_SECRET_KEY,
    expiration: process.env.JWT_EXPIRATION,
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    databaseURL: process.env.FIRESTORE_DB_URL,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
    storageLodgingFolder: process.env.STORAGE_LODGING_FOLDER,
  },
});
