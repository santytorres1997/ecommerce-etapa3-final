import 'dotenv/config';

export const PORT = process.env.PORT || 8080;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const DB_NAME = process.env.DB_NAME || 'ecommerce_db';
