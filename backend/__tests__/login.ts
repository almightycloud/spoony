import request from 'supertest';
import app from '../src/app';
import db from '../src/db';

const email = 'login@test.com';
const goodCreds = { email, password: 'password' };
const goodUser = { ...goodCreds, firstName: 'test', lastName: 'test', phoneNumber: '5555555555' };

beforeAll(async () => {
  await request(app.callback())
    .post('/api/v1/register')
    .send(goodUser);
});

afterAll(async () => {
  await db.delete().from('user').where({ email });
  await db.destroy();
});

it('returns 200 ok when sent a correct email and password', async () => {
  const response = await request(app.callback())
    .post('/api/v1/login')
    .send(goodUser);

  expect(response.status).toBe(200);
  expect(response.header).toHaveProperty('set-cookie');
});

it('returns 404 not found when sent an email that doesn\'t exist', async () => {
  const response = await request(app.callback())
    .post('/api/v1/login')
    .send({ ...goodUser, email: 'noone@test.com' });

  expect(response.status).toBe(404);
});

it('returns 404 not found when sent an incorrect password', async () => {
  const response = await request(app.callback())
    .post('/api/v1/login')
    .send({ ...goodUser, password: 'wrongpass' });

  expect(response.status).toBe(404);
});
