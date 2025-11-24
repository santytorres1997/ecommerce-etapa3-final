import { getDB } from '../config/db.js';

const COLLECTION = 'pedidos';

export async function create(pedido) {
  const db = getDB();
  const now = new Date();
  const doc = {
    ...pedido,
    createdAt: now,
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { id: result.insertedId.toString(), ...pedido, createdAt: now };
}
