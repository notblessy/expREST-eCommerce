const supertest = require('supertest');
const app = require('../../src/server');
const redis = require('../../src/redis');
const db = require('../../src/models');

describe('Test Auth', () => {
  let testDB = db;
  beforeAll(async () => {
    await testDB.sequelize.sync({ force: true });
  });

  it('should return error when submit form without password', async () => {
    await supertest(app)
      .post('/register')
      .send({
        name: 'Frederich Blessy',
        email: 'frederichblessy@gmail.com',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          message: [
            {
              field: 'password',
              message: 'required validation failed on password',
              validation: 'required',
            },
          ],
          success: false,
        });
      });
  });

  it('should register the user', async () => {
    await supertest(app)
      .post('/register')
      .send({
        name: 'Frederich Blessy',
        email: 'frederichblessy@gmail.com',
        password: '12345',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.data.name).toBe('Frederich Blessy');
        expect(response.body.data.email).toBe('frederichblessy@gmail.com');
      });
  });

  let token = null;

  it('should return token when login', async () => {
    await supertest(app)
      .post('/login')
      .send({
        email: 'frederichblessy@gmail.com',
        password: '12345',
      })
      .expect(200)
      .then((response) => {
        token = response.body.token;
        expect(response.body.type).toBe('Bearer');
      });
  });

  it('should return user profile', async () => {
    await supertest(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Frederich Blessy');
        expect(response.body.data.email).toBe('frederichblessy@gmail.com');
      });
  });

  afterAll(async () => {
    await testDB.sequelize.close();
    await redis.disconnect();
  });
});
