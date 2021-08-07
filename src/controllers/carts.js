const db = require('../models/index');
const validateAll = require('../utils/form');
const redis = require('../redis');

exports.addToCart = async (req, res) => {
  const rules = {
    product_id: 'required',
    qty: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const productID = req.body.product_id;
    const product = await db.Product.findOne({
      where: {
        id: productID,
      },
    });
    if (!product) {
      return res.json({
        success: false,
        message: 'Produk tidak ditemukan.',
      });
    }

    const cartKey = `cart:${req.user.identity}`;
    const existingCart = await redis.hgetall(cartKey);

    if (productID in existingCart) {
      const value = JSON.parse(existingCart[productID]);
      const qty = req.body.qty + value.qty;
      if (product.stock_qty < qty) {
        return res.json({
          success: false,
          message: 'Stok tidak cukup',
        });
      }
      const cartData = {
        productID: productID,
        qty: qty,
        timestamp: new Date().toISOString(),
      };
      await redis.hmset(cartKey, {
        [req.body.product_id]: JSON.stringify(cartData),
      });
      return res.json({
        success: true,
        data: cartData,
      });
    }

    if (product.stock_qty < req.body.qty) {
      return res.json({
        success: false,
        message: 'Stok tidak cukup',
      });
    }
    const cartData = {
      productID: productID,
      qty: req.body.qty,
      timestamp: new Date().toISOString(),
    };

    await redis.hmset(cartKey, {
      [req.body.product_id]: JSON.stringify(cartData),
    });

    return res.json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi kesalahan.',
    });
  }
};

exports.allCart = async (req, res) => {
  try {
    const cartKey = `cart:${req.user.identity}`;
    const cartData = await redis.hgetall(cartKey);
    const products = await db.Product.findAll({
      where: {
        id: Object.keys(cartData),
      },
    });
    const cartResult = products.map((product) => {
      return {
        ...JSON.parse(cartData[product.id]),
        product: product,
      };
    });

    return res.json({
      success: true,
      data: cartResult,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};

exports.editQty = async (req, res) => {
  try {
    const productID = req.params.id;
    const cartKey = `cart:${req.user.identity}`;
    const product = await db.Product.findOne({
      where: {
        id: productID,
      },
    });
    if (!product) {
      return res.json({
        success: false,
        message: 'Produk tidak ditemukan.',
      });
    }
    if (product.stock_qty < req.body.qty) {
      return res.json({
        success: false,
        message: 'Stok tidak cukup',
      });
    }
    const cartData = {
      productID: productID,
      qty: req.body.qty,
      timestamp: new Date().toISOString(),
    };

    await redis.hmset(cartKey, {
      [req.body.product_id]: JSON.stringify(cartData),
    });

    return res.json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi kesalahan.',
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cartKey = `cart:${req.user.identity}`;
    await redis.hdel(cartKey, req.params.id);

    return res.json({
      success: true,
      message: 'Data berhasil dihapus',
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi kesalahan.',
    });
  }
};
