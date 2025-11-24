import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

const COLLECTION = 'productos';

function normalizeId(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function getAll() {
  const db = getDB();
  const docs = await db.collection(COLLECTION).find().toArray();
  return docs.map(normalizeId);
}

export async function getById(id) {
  const db = getDB();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return normalizeId(doc);
}

export async function create(data) {
  const db = getDB();
  const now = new Date();
  const product = {
    nombre: data.nombre,
    precio: Number(data.precio),
    stock: Number(data.stock),
    marca: data.marca || '',
    categoria: data.categoria || '',
    descCorta: data.descCorta || '',
    descLarga: data.descLarga || '',
    envio: Boolean(data.envio),
    edadDesde: Number(data.edadDesde ?? 0),
    edadHasta: Number(data.edadHasta ?? 99),
    foto: data.foto || '',
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(COLLECTION).insertOne(product);
  return { id: result.insertedId.toString(), ...product };
}

export async function update(id, data) {
  const db = getDB();
  const _id = new ObjectId(id);
  const updateDoc = {
    $set: {
      nombre: data.nombre,
      precio: Number(data.precio),
      stock: Number(data.stock),
      marca: data.marca || '',
      categoria: data.categoria || '',
      descCorta: data.descCorta || '',
      descLarga: data.descLarga || '',
      envio: Boolean(data.envio),
      edadDesde: Number(data.edadDesde ?? 0),
      edadHasta: Number(data.edadHasta ?? 99),
      foto: data.foto || '',
      updatedAt: new Date(),
    },
  };
  await db.collection(COLLECTION).updateOne({ _id }, updateDoc);
  const doc = await db.collection(COLLECTION).findOne({ _id });
  return normalizeId(doc);
}

export async function remove(id) {
  const db = getDB();
  const _id = new ObjectId(id);
  const result = await db.collection(COLLECTION).deleteOne({ _id });
  return result.deletedCount > 0;
}
