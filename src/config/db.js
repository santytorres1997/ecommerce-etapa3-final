import { MongoClient } from 'mongodb';
import { MONGODB_URI, DB_NAME } from './config.js';

const client = new MongoClient(MONGODB_URI);
let db = null;

export async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(DB_NAME);
  console.log('✅ Conectado a MongoDB Atlas - DB:', DB_NAME);
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error('La base de datos no está inicializada. Llamá a connectDB() primero.');
  }
  return db;
}
