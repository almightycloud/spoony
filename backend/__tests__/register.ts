import request from 'supertest';
import app from '../src/app';
import db from '../src/db';

const email = 'register@test.com';
const goodUser = { email, firstName: 'test', lastName: 'test', password: 'password', phoneNumber: '5555555555' };

afterAll(async () => {
  await db.delete().from('user').where({ email });
  await db.destroy();
});

it('returns 201 ok when sent a valid user', async () => {
  const response = await request(app.callback())
    .post('/api/v1/register')
    .send(goodUser);

  expect(response.status).toBe(201);
  expect(response.header).toHaveProperty('set-cookie');
});

it('returns 400 bad request when sent an invalid user', async () => {
  [
    { firstName: '' },
    { lastName: '' },
    { password: 'bad' },
    { email: 'bad' },
    { phoneNumber: 'bad' },
  ].forEach(async (badUser) => {
    const response = await request(app.callback())
      .post('/api/v1/register')
      .send({ ...goodUser, ...badUser });

    expect(response.status).toBe(400);
  });
});

it('returns 409 conflict when email already exists', async () => {
  const response = await request(app.callback())
    .post('/api/v1/register')
    .send(goodUser);

  expect(response.status).toBe(409);
});
