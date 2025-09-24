export const ENV = {
  API_GATEWAY: process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:9090',
  NODE_ENV: process.env.NEXT_PUBLIC_ENV_TYPE || 'dev',
}