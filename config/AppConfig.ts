export const appConfig = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '24h'
};
