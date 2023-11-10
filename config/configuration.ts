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
    secret: process.env.JWT_SECRET_KEY,
    expiration: process.env.JWT_EXPIRATION,
  },
  cookie: {
    refreshToken: "refresh-token",
  },
});
