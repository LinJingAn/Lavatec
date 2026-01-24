// Environment variable typings for Next.js

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
    NEXT_PUBLIC_APP_NAME?: string;
    NEXT_PUBLIC_APP_DESCRIPTION?: string;
    NEXT_PUBLIC_ENVIRONMENT?: 'development' | 'production' | 'test';
  }
}
