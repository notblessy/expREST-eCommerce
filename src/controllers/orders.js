const db = require('../models/index');
const validateAll = require('../utils/form');
const redis = require('../redis');
const generateInv = require('../utils/invoice');

exports.getOrder = async (req, res) => {
  try {
    const order = await db.Order.findAll({
      where: {
        user_id: req.params.id,
      },
    });
    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};
exports.createOrder = async (req, res) => {
  const rules = {
    courier: 'required',
    address_id: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  const trx = await db.sequelize.transaction();

  try {
    const address = await db.Address.findOne(
      {
        where: {
          id: req.body.address_id,
        },
      },
      { transaction: trx }
    );

    const cartKey = `cart:${req.user.identity}`;
    const cartData = await redis.hgetall(cartKey);
    const products = await db.Product.findAll(
      {
        where: {
          id: Object.keys(cartData),
        },
      },
      { transaction: trx }
    );

    const cartResult = products.map((product) => {
      return {
        ...JSON.parse(cartData[product.id]),
        product: product,
      };
    });
    const total = cartResult.reduce((total, cartItem) => {
      total += cartItem.product.price * cartItem.qty;
      return total;
    }, 0);

    const getLatestOrder = await db.Order.findAll(
      {
        order: [['id', 'DESC']],
        limit: 1,
      },
      { transaction: trx }
    );

    const latestOrder = getLatestOrder.length ? getLatestOrder[0] : null;
    const inv = generateInv(latestOrder);

    const user = await db.User.findOne(
      {
        where: { id: req.user.identity },
      },
      { transaction: trx }
    );

    const order = await db.Order.create(
      {
        user_id: req.user.identity,
        invoice_no: inv,
        customer_name: user.name,
        customer_phone: address.phone,
        customer_address: address.address,
        courier: req.body.courier,
        status: 'WAITING_PAYMENT',
        total: total,
      },
      { transaction: trx }
    );

    const orderItem = cartResult.map((cart) => {
      const subtotal = cart.product.price * cart.qty;
      return db.OrderItem.create(
        {
          order_id: order.id,
          product_id: cart.productID,
          name: cart.product.name,
          price: cart.product.price,
          qty: cart.qty,
          subtotal: subtotal,
        },
        { transaction: trx }
      );
    });
    await Promise.all(orderItem);

    await db.OrderLog.create(
      {
        actor: 'CUSTOMER',
        status: order.status,
        order_id: order.id,
      },
      { transaction: trx }
    );

    await redis.del(cartKey);

    await trx.commit();

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);

    return res.json({
      success: false,
      message: 'Terjadi kesalahan.',
    });
  }
};

exports.confirmPayment = async (req, res) => {
  const trx = await db.sequelize.transaction();
  try {
    await db.Order.update(
      {
        status: 'PAYMENT_RECEIVED',
        paid_at: Date.now(),
      },
      {
        where: {
          id: req.params.id,
        },
      },
      { transaction: trx }
    );
    const order = await db.Order.findOne(
      {
        where: {
          id: req.params.id,
        },
      },
      { transaction: trx }
    );

    const items = await db.OrderItem.findAll({
      where: { order_id: req.params.id },
    });

    await Promise.all(
      items.map((item) => {
        return db.Product.findOne({
          where: { id: item.product_id },
        }).then((product) => {
          if (product.stock_qty < item.qty) {
            return Promise.reject('Stok tidak mencukupi.');
          }

          product.stock_qty -= item.qty;

          return product.save({ transaction: trx });
        });
      })
    );

    await db.OrderLog.create(
      {
        actor: 'ADMIN',
        status: order.status,
        order_id: order.id,
      },
      { transaction: trx }
    );
    await trx.commit();

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);

    return res.json({
      success: false,
      message: 'Terjadi kesalahan.',
    });
  }
};
