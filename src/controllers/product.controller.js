import * as Product from '../models/product.model.js';

export async function getAll(req, res, next) {
  try {
    const productos = await Product.getAll();
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const producto = await Product.getById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const nuevo = await Product.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const actualizado = await Product.update(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await Product.remove(req.params.id);
    if (!ok) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
}
