declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        MONGO_PASSWORD: string;
        MONGO_USER: string;
        MONGO_SERVER: string;
        REDIS_CREDS: string;
        JWT_SECRET: string;
      }
    }
  }