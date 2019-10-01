import request from 'supertest';
import app from '../src/app';
import db from '../src/db';

const email = 'logout@test.com';
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
  const response = await request(app.callback())
    .post('/api/v1/logout')
    .set('cookie', cookie);

  expect(response.status).toBe(200);
  expect(response.header).toHaveProperty('set-cookie');
});

it('retuns 401 unauthorized when sent an invalid cookie', async () => {
  ['', 'jwt=123;'].forEach(async (c) => {
    const response = await request(app.callback())
      .get('/api/v1/self')
      .set('cookie', c);

    expect(response.status).toBe(401);
  });
});
