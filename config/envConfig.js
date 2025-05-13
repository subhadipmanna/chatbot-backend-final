require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    env: process.env.NODE_ENV || 'development'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  }
};