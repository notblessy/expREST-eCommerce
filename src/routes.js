const { Router } = require('express');
const expressJWT = require('express-jwt');

const config = require('./config');
const auth = require('./controllers/auth');
const product = require('./controllers/products');
const cart = require('./controllers/carts');
const address = require('./controllers/addresses');
const order = require('./controllers/orders');

const routes = Router();

const jwtMiddleware = expressJWT({
  secret: config.JWT_SECRET,
  algorithms: [config.JWT_ALGORITHM],
  issuer: config.JWT_ISSUER,
});

routes.get('/', (_, res) => {
  return res.json({ ping: 'pong!' });
});

routes.post('/register', auth.register);
routes.post('/login', auth.login);
routes.get('/profile', jwtMiddleware, auth.profile);
routes.put('/profile', jwtMiddleware, auth.edit);
routes.put('/profile/password', jwtMiddleware, auth.editPassword);

routes.get('/product', jwtMiddleware, product.allProduct);
routes.post('/product', jwtMiddleware, product.createProduct);
routes.put('/product/:id', jwtMiddleware, product.updateProduct);
routes.delete('/product/:id', jwtMiddleware, product.deleteProduct);

routes.get('/carts', jwtMiddleware, cart.allCart);
routes.post('/carts', jwtMiddleware, cart.addToCart);
routes.put('/carts/:id', jwtMiddleware, cart.editQty);
routes.delete('/carts/:id', jwtMiddleware, cart.deleteCart);

routes.get('/address', jwtMiddleware, address.allAddresses);
routes.post('/address', jwtMiddleware, address.createAddress);
routes.put('/address/:id', jwtMiddleware, address.updateAddress);
routes.delete('/address/:id', jwtMiddleware, address.deleteAddress);

routes.post('/order', jwtMiddleware, order.createOrder);
routes.get('/order/:id', jwtMiddleware, order.getOrder);
routes.put('/order/:id', jwtMiddleware, order.confirmPayment);

module.exports = routes;
