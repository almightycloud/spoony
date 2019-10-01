import request from 'supertest';
import app from '../src/app';
import db from '../src/db';

const email = 'self@test.com';
const goodCreds = { email, password: 'password' };
const goodUser = { ...goodCreds, firstName: 'test', lastName: 'test', phoneNumber: '5555555555' };

let cookie: string;

beforeAll(async () => {
  const response = await request(app.callback())
    .post('/api/v1/register')
    .send(goodUser);

  [cookie] = response.header['set-cookie'];
});

afterAll(async () => {
  await db.delete().from('user').where({ email });
  await db.destroy();
});

it('returns 200 ok when sent a valid cookie', async () => {
  const expectedUser = { ...goodUser, phoneNumber: '555-555-5555' };
  delete expectedUser.password;

  const response = await request(app.callback())
    .get('/api/v1/self')
    .set('cookie', cookie);

  expect(response.status).toBe(200);
  expect(response.body).not.toHaveProperty('password');
  expect(response.body).toMatchObject(expectedUser);
});

it('returns 401 unauthorized when sent an invalid cookie', async () => {
  ['', 'jwt=123;'].forEach(async (c) => {
    const response = await request(app.callback())
      .get('/api/v1/self')
      .set('cookie', c);

    expect(response.status).toBe(401);
  });
});
