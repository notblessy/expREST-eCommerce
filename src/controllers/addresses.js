const db = require('../models/index');
const validateAll = require('../utils/form');

exports.allAddresses = async (req, res) => {
  try {
    const address = await db.Address.findAll();
    return res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};

exports.createAddress = async (req, res) => {
  const rules = {
    name: 'required',
    phone: 'required',
    address: 'required',
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
    const address = await db.Address.create(
      {
        user_id: req.user.identity,
        name: req.body.name,
        address: req.body.address,
        province: req.body.province,
        regency: req.body.regency,
        district: req.body.district,
        village: req.body.village,
        postal_code: req.body.postal_code,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
      },
      { transaction: trx }
    );

    await trx.commit();

    return res.json({
      success: true,
      data: address,
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

exports.updateAddress = async (req, res) => {
  const trx = await db.sequelize.transaction();
  try {
    const address = await db.Product.update(
      {
        user_id: req.user.identity,
        name: req.body.name,
        address: req.body.address,
        province: req.body.province,
        regency: req.body.regency,
        district: req.body.district,
        village: req.body.village,
        postal_code: req.body.postal_code,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
      },
      {
        where: {
          id: req.params.id,
        },
      },
      { transaction: trx }
    );
    await trx.commit();
    return res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await db.Address.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi Kesalahan.',
    });
  }
};
