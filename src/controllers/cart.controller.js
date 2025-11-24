import * as CartModel from '../models/cart.model.js';

export async function create(req, res, next) {
  try {
    const pedido = req.body;
    console.log('🛒 Pedido recibido desde el frontend:');
    console.log(JSON.stringify(pedido, null, 2));

    // Opcional: guardar el pedido en MongoDB
    let saved = null;
    try {
      saved = await CartModel.create(pedido);
    } catch (err) {
      console.error('No se pudo guardar el pedido en MongoDB (se muestra igual en consola):', err.message);
    }

    res.status(201).json({
      ok: true,
      message: 'Pedido recibido correctamente',
      pedido: saved || pedido,
    });
  } catch (err) {
    next(err);
  }
}
