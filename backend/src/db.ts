import { camelizeKeys, decamelize } from 'humps';
import knex from 'knex';

export default knex({
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
  wrapIdentifier: (value, origImpl) => origImpl(decamelize(value)),
  postProcessResponse: (result) => (
    Array.isArray(result)
      ? result.map((x) => camelizeKeys(x))
      : camelizeKeys(result)
  ),
});
