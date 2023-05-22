export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      ENV: string;
      PORT: string;
      HOST: string;
      API_DOCS: string;
    }
  }
}
