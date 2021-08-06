const db = require('../models/index');
const validateAll = require('../utils/form');
const { paramCase } = require('change-case');
const { nanoid } = require('nanoid');

exports.allProduct = async (req, res) => {
  try {
    const product = await db.User.findAll();
    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};

exports.createProduct = async (req, res) => {
  const rules = {
    name: 'required',
    price: 'required',
    stock_qty: 'required',
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
    const slug = paramCase(req.body.name) + '-' + nanoid();
    const data = await db.Product.create(
      {
        name: req.body.name,
        slug: slug,
        price: req.body.price,
        stock_qty: req.body.stock_qty,
      },
      { transaction: trx }
    );

    await trx.commit();

    return res.json({
      success: true,
      data: data,
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

exports.updateProduct = async (req, res) => {
  try {
    const slug = paramCase(req.body.name) + '-' + nanoid();

    const product = await db.Product.update(
      {
        name: req.body.name,
        slug: slug,
        price: req.body.price,
        stock_qty: req.body.stock_qty,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await db.Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};
