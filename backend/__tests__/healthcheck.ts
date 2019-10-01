import supertest from 'supertest';
import app from '../src/app';
import db from '../src/db';

afterAll(async () => {
  await db.destroy();
});

it('returns 200 on successful healthcheck', async () => {
  const response = await supertest(app.callback()).get('/api/v1/healthcheck');
  expect(response.status).toBe(200);
});
