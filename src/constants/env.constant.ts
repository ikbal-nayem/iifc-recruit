export const ENV = {
  API_GATEWAY: process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:3000/api/v1',
  NODE_ENV: process.env.NODE_ENV || 'development',
}